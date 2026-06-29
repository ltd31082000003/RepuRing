const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contract = fs.readFileSync(path.join(root, 'src/contract/contract.ts'), 'utf8');
const proto = fs.readFileSync(path.join(root, 'proto/tx.proto'), 'utf8');
const routes = fs.readFileSync(path.resolve(root, '../../cmd/rpc/routes.go'), 'utf8');
const repuringRpc = fs.readFileSync(path.resolve(root, '../../cmd/rpc/repuring.go'), 'utf8');

function extractBlock(source, needle) {
  const start = source.indexOf(needle);
  assert(start >= 0, needle + ' block missing');
  const open = source.indexOf('{', start + needle.length);
  assert(open >= 0, needle + ' opening brace missing');
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  assert.fail(needle + ' closing brace missing');
}

function protoFields(messageName) {
  const body = extractBlock(proto, 'message ' + messageName + ' ');
  return [...body.matchAll(/^\s*(?:repeated\s+)?[\w.]+\s+(\w+)\s*=\s*\d+/gm)].map((match) => match[1]);
}

function assertFields(messageName, expectedFields) {
  assert.deepStrictEqual(
    protoFields(messageName),
    expectedFields,
    messageName + ' fields changed unexpectedly'
  );
}

function deliverBlock(name) {
  return extractBlock(contract, 'static async ' + name + '(');
}

function checkBlock(name) {
  return extractBlock(contract, name + '(');
}

function assertIncludes(source, snippets, label) {
  for (const snippet of snippets) {
    assert(source.includes(snippet), label + ' missing behavior: ' + snippet);
  }
}

const txs = [
  ['createProfile', 'MessageCreateProfile'],
  ['updateProfile', 'MessageUpdateProfile'],
  ['createCircle', 'MessageCreateCircle'],
  ['joinCircle', 'MessageJoinCircle'],
  ['leaveCircle', 'MessageLeaveCircle'],
  ['createContribution', 'MessageCreateContribution'],
  ['endorseUser', 'MessageEndorseUser'],
  ['endorseContribution', 'MessageEndorseContribution'],
  ['slashEndorsement', 'MessageSlashEndorsement'],
  ['claimRole', 'MessageClaimRole'],
];

for (const [name, message] of txs) {
  assert(contract.includes(`'${name}'`), `${name} missing from supportedTransactions`);
  assert(
    contract.includes(`type.googleapis.com/types.${message}`),
    `${message} type URL missing from ContractConfig`
  );
  assert(proto.includes(`message ${message}`), `${message} missing from tx.proto`);
}

for (const tag of ['builder', 'helper', 'creator', 'leader', 'trusted']) {
  assert(contract.includes(`'${tag}'`), `${tag} endorsement tag missing`);
}

for (const category of ['builder', 'helper', 'creator', 'researcher', 'tester', 'educator']) {
  assert(contract.includes(`'${category}'`), `${category} contribution category missing`);
}

for (const route of [
  '/v1/query/repuring/profile',
  '/v1/query/repuring/circle',
  '/v1/query/repuring/circles',
  '/v1/query/repuring/circle-members',
  '/v1/query/repuring/reputation',
  '/v1/query/repuring/role',
  '/v1/query/repuring/endorsements-for-user',
  '/v1/query/repuring/endorsements-in-circle',
  '/v1/query/repuring/leaderboard',
  '/v1/query/repuring/contribution',
  '/v1/query/repuring/contributions-in-circle',
  '/v1/query/repuring/contributions-for-user',
]) {
  assert(routes.includes(route), route + ' missing from RPC routes');
}

// Circle discovery: the read-only list route must be wired end to end (path, name, handler)
// so the UI can list circles without users memorizing circle IDs.
assert(routes.includes('RepuRingCirclesRoutePath'), 'RepuRingCirclesRoutePath constant missing from routes.go');
assert(routes.includes('RepuRingCirclesRouteName'), 'RepuRingCirclesRouteName constant missing from routes.go');
assert(routes.includes('s.RepuRingCircles'), 'RepuRingCircles handler not mapped in routes.go');
assert(repuringRpc.includes('func (s *Server) RepuRingCircles('), 'RepuRingCircles handler missing from repuring.go');
// Discovery iterates circle state by the circle prefix, not a single circleId lookup.
assert(repuringRpc.includes('repuringGetAllCircles'), 'repuringGetAllCircles iterator helper missing from repuring.go');
assert(
  /Iterator\(repuringKey\(repuringCirclePrefix\)\)/.test(repuringRpc),
  'circle discovery must iterate state by repuringCirclePrefix'
);

// Comments/reviews reuse the existing endorsement protocol: there must be NO separate
// CommentTx, and the demo must not introduce comment-only messages into tx.proto.
assert(!proto.includes('MessageComment'), 'tx.proto must not add a CommentTx message');
assert(!proto.includes('message Comment'), 'tx.proto must not add a Comment state message');
assert(!contract.includes("'comment'"), 'contract must not register a comment transaction');
// Endorsement must keep the fields the UI relies on to render reviews/comments.
assert(protoFields('Endorsement').includes('message'), 'Endorsement.message field required for review comments');
assert(protoFields('Endorsement').includes('contribution_id'), 'Endorsement.contribution_id field required to attach reviews to a contribution');
assert(proto.includes('message MessageEndorseContribution'), 'EndorseContributionTx must remain the review/comment path');

// Protobuf field invariants protect immutable usernames and reputation ownership.
assertFields('MessageUpdateProfile', ['sender_address', 'bio', 'avatar_url']);
assert(!protoFields('MessageUpdateProfile').includes('username'), 'UpdateProfileTx must not include username');
assert(!protoFields('MessageUpdateProfile').includes('reputation'), 'UpdateProfileTx must not include reputation');
assertFields('MessageCreateProfile', ['sender_address', 'username', 'bio', 'avatar_url']);
assertFields('Profile', ['address', 'username', 'bio', 'avatar_url', 'reputation']);
assertFields('Contribution', [
  'contribution_id',
  'circle_id',
  'author_address',
  'title',
  'description',
  'proof_url',
  'category',
  'endorsement_count',
  'slashed',
]);
assertFields('Endorsement', [
  'endorsement_id',
  'circle_id',
  'from_address',
  'target_address',
  'tag',
  'message',
  'slashed',
  'slash_reason',
  'contribution_id',
]);
assertFields('Role', ['circle_id', 'address', 'role', 'reputation']);

assert(proto.includes('message Contribution'), 'Contribution state message missing from tx.proto');
// Stateful profile behavior.
const createProfile = deliverBlock('DeliverMessageCreateProfile');
assertIncludes(createProfile, [
  "if (profile[0]) return { error: ErrRepuRing('address already has a profile') }",
  "if (usernameTaken[1]) return { error: ErrRepuRing('username already exists') }",
  'reputation: Long.ZERO',
], 'CreateProfileTx');

const updateProfile = deliverBlock('DeliverMessageUpdateProfile');
assertIncludes(updateProfile, [
  "if (!profile) return { error: ErrRepuRing('sender must create a profile first') }",
  '...profile',
  'bio: clean(msg.bio)',
  'avatarUrl: clean(msg.avatarUrl)',
], 'UpdateProfileTx');
assert(!updateProfile.includes('username:'), 'UpdateProfileTx must preserve username');
assert(!updateProfile.includes('reputation:'), 'UpdateProfileTx must preserve reputation');

// Circle membership behavior.
const createCircle = deliverBlock('DeliverMessageCreateCircle');
assertIncludes(createCircle, [
  "if (!profile[0]) return { error: ErrRepuRing('sender must create a profile first') }",
  "if (circle[0]) return { error: ErrRepuRing('circle_id already exists') }",
  'members: [sender]',
  'KeyForMember(circleId, sender)',
], 'CreateCircleTx');

const joinCircle = deliverBlock('DeliverMessageJoinCircle');
assertIncludes(joinCircle, [
  "if (!profile[0]) return { error: ErrRepuRing('sender must create a profile first') }",
  'const isListedMember = existingMembers.some',
  'if (member[1] && isListedMember)',
  'const staleDeletes = member[1] && !isListedMember ? [KeyForRole(circleId, sender)] : []',
], 'JoinCircleTx');

const leaveCircle = deliverBlock('DeliverMessageLeaveCircle');
assertIncludes(leaveCircle, [
  "if (!profile[0]) return { error: ErrRepuRing('sender must create a profile first') }",
  "if (!member[1]) return { error: ErrRepuRing('sender is not a circle member') }",
  "return { error: ErrRepuRing('circle creator cannot leave their own circle') }",
  'KeyForRole(circleId, sender)',
], 'LeaveCircleTx');

// Contribution creation behavior.
const createContribution = deliverBlock('DeliverMessageCreateContribution');
assertIncludes(createContribution, [
  "if (!profile[0]) return { error: ErrRepuRing('sender must create a profile first') }",
  "if (!circle[0]) return { error: ErrRepuRing('circle does not exist') }",
  "if (!member[1]) return { error: ErrRepuRing('sender must be a circle member') }",
  "if (contribution[0]) return { error: ErrRepuRing('contribution_id already exists') }",
  'endorsementCount: Long.ZERO',
  'slashed: false',
], 'CreateContributionTx');

// Contribution-native endorsement behavior.
const endorseContribution = deliverBlock('DeliverMessageEndorseContribution');
assertIncludes(endorseContribution, [
  "if (!contribution) return { error: ErrRepuRing('contribution does not exist') }",
  "if (contribution.slashed) return { error: ErrRepuRing('contribution is slashed') }",
  "return { error: ErrRepuRing('sender cannot endorse own contribution') }",
  "if (!senderProfile[0]) return { error: ErrRepuRing('sender must create a profile first') }",
  "if (!authorProfileData) return { error: ErrRepuRing('contribution author must have a profile') }",
  "if (!senderMember[1]) return { error: ErrRepuRing('sender must be a circle member') }",
  "if (previous[1]) return { error: ErrRepuRing('sender already endorsed this contribution') }",
  'toLong(authorProfileData.reputation).add(1)',
  'toLong(contribution.endorsementCount).add(1)',
  'contributionId',
], 'EndorseContributionTx');

// Legacy member endorsement remains protected for compatibility.
const checkEndorseUser = checkBlock('CheckMessageEndorseUser');
assert(checkEndorseUser.includes('sender cannot endorse self'), 'EndorseUserTx must reject self endorsement');
const endorseUser = deliverBlock('DeliverMessageEndorseUser');
assertIncludes(endorseUser, [
  "return { error: ErrRepuRing('sender and target must both be circle members') }",
  "return { error: ErrRepuRing('sender already endorsed this target in the circle') }",
  'toLong(targetProfileData.reputation).add(1)',
], 'EndorseUserTx legacy');

// Slashing behavior and floor-at-zero protection.
const slashEndorsement = deliverBlock('DeliverMessageSlashEndorsement');
assertIncludes(slashEndorsement, [
  "if (!endorsement) return { error: ErrRepuRing('endorsement does not exist') }",
  "if (endorsement.slashed) return { error: ErrRepuRing('endorsement already slashed') }",
  "return { error: ErrRepuRing('only circle creator/admin can slash endorsement') }",
  'toLong(profile.reputation).lessThan(2)',
  '? Long.ZERO',
  ': toLong(profile.reputation).subtract(2)',
  'slashed: true',
  'slashReason: clean(msg.reason)',
  'toLong(contribution.endorsementCount).equals(Long.ZERO)',
  ': toLong(contribution.endorsementCount).subtract(1)',
], 'SlashEndorsementTx');

// ClaimRoleTx must use the fixed role mapping.
const claimRole = deliverBlock('DeliverMessageClaimRole');
assertIncludes(claimRole, [
  "if (!profile) return { error: ErrRepuRing('sender must create a profile first') }",
  "if (!memberResult[1]) return { error: ErrRepuRing('sender is not a circle member') }",
  'const role = roleForReputation(reputation)',
], 'ClaimRoleTx');

const roleMapping = extractBlock(contract, 'function roleForReputation(');
assertIncludes(roleMapping, [
  "greaterThanOrEqual(30)) return 'Circle Leader'",
  "greaterThanOrEqual(15)) return 'Core Member'",
  "greaterThanOrEqual(5)) return 'Trusted'",
  "return 'Newbie'",
], 'roleForReputation thresholds');
assert(contract.includes('DeliverMessageUpdateProfile'), 'UpdateProfileTx DeliverTx missing');
assert(contract.includes('DeliverMessageCreateContribution'), 'CreateContributionTx DeliverTx missing');
assert(contract.includes('DeliverMessageEndorseContribution'), 'EndorseContributionTx DeliverTx missing');

console.log('RepuRing protocol invariant and source behavior tests passed');
