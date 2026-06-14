/* RepuRing Social-Fi contract for the Canopy TypeScript plugin. */

import { createHash } from 'crypto';
import Long from 'long';

import { types } from '../proto/types.js';

import { IPluginError, ErrInvalidAddress, ErrInvalidMessageCast, NewError } from './error.js';
import type { Plugin, Config } from './plugin.js';
import { JoinLenPrefix, FromAny, Unmarshal } from './plugin.js';
import { fileDescriptorProtos } from '../proto/descriptors.js';

const moduleName = 'repuring';
const validTags = new Set(['builder', 'helper', 'creator', 'leader', 'trusted']);
const validContributionCategories = new Set(['builder', 'helper', 'creator', 'researcher', 'tester', 'educator']);

// ContractConfig registers every custom RepuRing transaction with Canopy.
// The order must match supportedTransactions <-> transactionTypeUrls.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ContractConfig: any = {
    name: 'repuring_social_fi',
    id: 1,
    version: 1,
    supportedTransactions: [
        'createProfile',
        'createCircle',
        'joinCircle',
        'createContribution',
        'endorseUser',
        'endorseContribution',
        'slashEndorsement',
        'claimRole'
    ],
    transactionTypeUrls: [
        'type.googleapis.com/types.MessageCreateProfile',
        'type.googleapis.com/types.MessageCreateCircle',
        'type.googleapis.com/types.MessageJoinCircle',
        'type.googleapis.com/types.MessageCreateContribution',
        'type.googleapis.com/types.MessageEndorseUser',
        'type.googleapis.com/types.MessageEndorseContribution',
        'type.googleapis.com/types.MessageSlashEndorsement',
        'type.googleapis.com/types.MessageClaimRole'
    ],
    eventTypeUrls: [],
    fileDescriptorProtos
};

export class Contract {
    Config: Config;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FSMConfig: any;
    plugin: Plugin;
    fsmId: Long;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(config: Config, fsmConfig: any, plugin: Plugin, fsmId: Long) {
        this.Config = config;
        this.FSMConfig = fsmConfig;
        this.plugin = plugin;
        this.fsmId = fsmId;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    Genesis(_request: any): any {
        return {};
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    BeginBlock(_request: any): any {
        return {};
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    EndBlock(_request: any): any {
        return {};
    }

    // Stateless validation returns the address that must sign the transaction.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CheckMessageCreateProfile(msg: any): any {
        if (!isAddress(msg.senderAddress)) return { error: ErrInvalidAddress() };
        if (!clean(msg.username)) return { error: ErrRepuRing('username must not be empty') };
        return signerResponse(msg.senderAddress);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CheckMessageCreateCircle(msg: any): any {
        if (!isAddress(msg.senderAddress)) return { error: ErrInvalidAddress() };
        if (!clean(msg.circleId)) return { error: ErrRepuRing('circle_id must not be empty') };
        if (!clean(msg.name)) return { error: ErrRepuRing('circle name must not be empty') };
        return signerResponse(msg.senderAddress);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CheckMessageJoinCircle(msg: any): any {
        if (!isAddress(msg.senderAddress)) return { error: ErrInvalidAddress() };
        if (!clean(msg.circleId)) return { error: ErrRepuRing('circle_id must not be empty') };
        return signerResponse(msg.senderAddress);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CheckMessageCreateContribution(msg: any): any {
        if (!isAddress(msg.senderAddress)) return { error: ErrInvalidAddress() };
        if (!clean(msg.contributionId)) return { error: ErrRepuRing('contribution_id must not be empty') };
        if (!clean(msg.circleId)) return { error: ErrRepuRing('circle_id must not be empty') };
        if (!clean(msg.title)) return { error: ErrRepuRing('contribution title must not be empty') };
        if (!validContributionCategories.has(clean(msg.category))) {
            return { error: ErrRepuRing('contribution category is not allowed') };
        }
        return signerResponse(msg.senderAddress);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CheckMessageEndorseUser(msg: any): any {
        if (!isAddress(msg.senderAddress) || !isAddress(msg.targetAddress)) {
            return { error: ErrInvalidAddress() };
        }
        if (bytesEqual(msg.senderAddress, msg.targetAddress)) {
            return { error: ErrRepuRing('sender cannot endorse self') };
        }
        if (!clean(msg.circleId)) return { error: ErrRepuRing('circle_id must not be empty') };
        if (!validTags.has(clean(msg.tag))) return { error: ErrRepuRing('tag is not allowed') };
        return signerResponse(msg.senderAddress, msg.targetAddress);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CheckMessageEndorseContribution(msg: any): any {
        if (!isAddress(msg.senderAddress)) return { error: ErrInvalidAddress() };
        if (!clean(msg.contributionId)) return { error: ErrRepuRing('contribution_id must not be empty') };
        if (!validTags.has(clean(msg.tag))) return { error: ErrRepuRing('tag is not allowed') };
        return signerResponse(msg.senderAddress);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CheckMessageSlashEndorsement(msg: any): any {
        if (!isAddress(msg.senderAddress)) return { error: ErrInvalidAddress() };
        if (!clean(msg.endorsementId)) {
            return { error: ErrRepuRing('endorsement_id must not be empty') };
        }
        if (!clean(msg.reason)) return { error: ErrRepuRing('slash reason must not be empty') };
        return signerResponse(msg.senderAddress);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CheckMessageClaimRole(msg: any): any {
        if (!isAddress(msg.senderAddress)) return { error: ErrInvalidAddress() };
        if (!clean(msg.circleId)) return { error: ErrRepuRing('circle_id must not be empty') };
        return signerResponse(msg.senderAddress);
    }
}

export class ContractAsync {
    // CheckTx performs stateless validation and signer authorization.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async CheckTx(contract: Contract, request: any): Promise<any> {
        const [msg, msgType, msgErr] = FromAny(request.tx?.msg);
        if (msgErr) return { error: msgErr };
        if (!msg) return { error: ErrInvalidMessageCast() };

        switch (msgType) {
            case 'MessageCreateProfile':
                return contract.CheckMessageCreateProfile(msg);
            case 'MessageCreateCircle':
                return contract.CheckMessageCreateCircle(msg);
            case 'MessageJoinCircle':
                return contract.CheckMessageJoinCircle(msg);
            case 'MessageCreateContribution':
                return contract.CheckMessageCreateContribution(msg);
            case 'MessageEndorseUser':
                return contract.CheckMessageEndorseUser(msg);
            case 'MessageEndorseContribution':
                return contract.CheckMessageEndorseContribution(msg);
            case 'MessageSlashEndorsement':
                return contract.CheckMessageSlashEndorsement(msg);
            case 'MessageClaimRole':
                return contract.CheckMessageClaimRole(msg);
            default:
                return { error: ErrInvalidMessageCast() };
        }
    }

    // DeliverTx performs stateful validation and deterministic state transitions.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverTx(contract: Contract, request: any): Promise<any> {
        const [msg, msgType, err] = FromAny(request.tx?.msg);
        if (err) return { error: err };
        if (!msg) return { error: ErrInvalidMessageCast() };

        switch (msgType) {
            case 'MessageCreateProfile':
                return ContractAsync.DeliverMessageCreateProfile(contract, msg);
            case 'MessageCreateCircle':
                return ContractAsync.DeliverMessageCreateCircle(contract, msg);
            case 'MessageJoinCircle':
                return ContractAsync.DeliverMessageJoinCircle(contract, msg);
            case 'MessageCreateContribution':
                return ContractAsync.DeliverMessageCreateContribution(contract, msg);
            case 'MessageEndorseUser':
                return ContractAsync.DeliverMessageEndorseUser(contract, msg);
            case 'MessageEndorseContribution':
                return ContractAsync.DeliverMessageEndorseContribution(contract, msg);
            case 'MessageSlashEndorsement':
                return ContractAsync.DeliverMessageSlashEndorsement(contract, msg);
            case 'MessageClaimRole':
                return ContractAsync.DeliverMessageClaimRole(contract, msg);
            default:
                return { error: ErrInvalidMessageCast() };
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverMessageCreateProfile(contract: Contract, msg: any): Promise<any> {
        const sender = msg.senderAddress as Uint8Array;
        const username = clean(msg.username);
        const profileKey = KeyForProfile(sender);
        const usernameKey = KeyForUsername(username);
        const [reads, err] = await readMany(contract, [
            [profileKey, types.Profile],
            [usernameKey, null]
        ]);
        if (err) return { error: err };
        const [profile, usernameTaken] = reads;
        if (profile[0]) return { error: ErrRepuRing('address already has a profile') };
        if (usernameTaken[1]) return { error: ErrRepuRing('username already exists') };

        const profileBytes = types.Profile.encode(
            types.Profile.create({
                address: sender,
                username,
                bio: clean(msg.bio),
                avatarUrl: clean(msg.avatarUrl),
                reputation: Long.ZERO
            })
        ).finish();
        return write(contract, [
            { key: profileKey, value: profileBytes },
            { key: usernameKey, value: sender }
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverMessageCreateCircle(contract: Contract, msg: any): Promise<any> {
        const sender = msg.senderAddress as Uint8Array;
        const circleId = clean(msg.circleId);
        const [reads, err] = await readMany(contract, [
            [KeyForProfile(sender), types.Profile],
            [KeyForCircle(circleId), types.Circle]
        ]);
        if (err) return { error: err };
        const [profile, circle] = reads;
        if (!profile[0]) return { error: ErrRepuRing('sender must create a profile first') };
        if (circle[0]) return { error: ErrRepuRing('circle_id already exists') };

        const circleBytes = types.Circle.encode(
            types.Circle.create({
                circleId,
                name: clean(msg.name),
                description: clean(msg.description),
                creatorAddress: sender,
                members: [sender]
            })
        ).finish();
        return write(contract, [
            { key: KeyForCircle(circleId), value: circleBytes },
            { key: KeyForMember(circleId, sender), value: oneByte() }
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverMessageJoinCircle(contract: Contract, msg: any): Promise<any> {
        const sender = msg.senderAddress as Uint8Array;
        const circleId = clean(msg.circleId);
        const [reads, err] = await readMany(contract, [
            [KeyForProfile(sender), types.Profile],
            [KeyForCircle(circleId), types.Circle],
            [KeyForMember(circleId, sender), null]
        ]);
        if (err) return { error: err };
        const [profile, circle, member] = reads;
        if (!profile[0]) return { error: ErrRepuRing('sender must create a profile first') };
        const circleData = circle[0] as any | null;
        if (!circleData) return { error: ErrRepuRing('circle does not exist') };
        if (member[1]) return { error: ErrRepuRing('sender is already a circle member') };

        const members = [...(circleData.members || []), sender].sort(compareBytes);
        const updatedCircle = types.Circle.encode(
            types.Circle.create({ ...circleData, members })
        ).finish();
        return write(contract, [
            { key: KeyForCircle(circleId), value: updatedCircle },
            { key: KeyForMember(circleId, sender), value: oneByte() }
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverMessageCreateContribution(contract: Contract, msg: any): Promise<any> {
        const sender = msg.senderAddress as Uint8Array;
        const circleId = clean(msg.circleId);
        const contributionId = clean(msg.contributionId);
        const [reads, err] = await readMany(contract, [
            [KeyForProfile(sender), types.Profile],
            [KeyForCircle(circleId), types.Circle],
            [KeyForMember(circleId, sender), null],
            [KeyForContribution(contributionId), types.Contribution]
        ]);
        if (err) return { error: err };
        const [profile, circle, member, contribution] = reads;
        if (!profile[0]) return { error: ErrRepuRing('sender must create a profile first') };
        if (!circle[0]) return { error: ErrRepuRing('circle does not exist') };
        if (!member[1]) return { error: ErrRepuRing('sender must be a circle member') };
        if (contribution[0]) return { error: ErrRepuRing('contribution_id already exists') };

        const contributionBytes = types.Contribution.encode(
            types.Contribution.create({
                contributionId,
                circleId,
                authorAddress: sender,
                title: clean(msg.title),
                description: clean(msg.description),
                proofUrl: clean(msg.proofUrl),
                category: clean(msg.category),
                endorsementCount: Long.ZERO,
                slashed: false
            })
        ).finish();
        return write(contract, [
            { key: KeyForContribution(contributionId), value: contributionBytes },
            { key: KeyForCircleContribution(circleId, contributionId), value: oneByte() },
            { key: KeyForUserContribution(sender, contributionId), value: oneByte() }
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverMessageEndorseUser(contract: Contract, msg: any): Promise<any> {
        const sender = msg.senderAddress as Uint8Array;
        const target = msg.targetAddress as Uint8Array;
        const circleId = clean(msg.circleId);
        const endorsementId = makeEndorsementId(circleId, sender, target);
        const [reads, err] = await readMany(contract, [
                [KeyForProfile(sender), types.Profile],
                [KeyForProfile(target), types.Profile],
                [KeyForCircle(circleId), types.Circle],
                [KeyForMember(circleId, sender), null],
                [KeyForMember(circleId, target), null],
                [KeyForPairEndorsement(circleId, sender, target), null]
            ]);
        if (err) return { error: err };
        const [senderProfile, targetProfile, circle, senderMember, targetMember, previous] = reads;
        if (!senderProfile[0]) return { error: ErrRepuRing('sender must create a profile first') };
        const targetProfileData = targetProfile[0] as any | null;
        if (!targetProfileData) return { error: ErrRepuRing('target must have a profile') };
        if (!circle[0]) return { error: ErrRepuRing('circle does not exist') };
        if (!senderMember[1] || !targetMember[1]) {
            return { error: ErrRepuRing('sender and target must both be circle members') };
        }
        if (previous[1]) {
            return { error: ErrRepuRing('sender already endorsed this target in the circle') };
        }

        const reputation = toLong(targetProfileData.reputation).add(1);
        const updatedProfile = types.Profile.encode(
            types.Profile.create({ ...targetProfileData, reputation })
        ).finish();
        const endorsement = types.Endorsement.encode(
            types.Endorsement.create({
                endorsementId,
                circleId,
                fromAddress: sender,
                targetAddress: target,
                tag: clean(msg.tag),
                message: clean(msg.message),
                slashed: false
            })
        ).finish();
        return write(contract, [
            { key: KeyForProfile(target), value: updatedProfile },
            { key: KeyForEndorsement(endorsementId), value: endorsement },
            { key: KeyForCircleEndorsement(circleId, endorsementId), value: oneByte() },
            { key: KeyForUserEndorsement(target, endorsementId), value: oneByte() },
            { key: KeyForPairEndorsement(circleId, sender, target), value: Buffer.from(endorsementId) }
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverMessageEndorseContribution(contract: Contract, msg: any): Promise<any> {
        const sender = msg.senderAddress as Uint8Array;
        const contributionId = clean(msg.contributionId);
        const endorsementId = makeContributionEndorsementId(contributionId, sender);
        const [contributionResult, err1] = await readOne(
            contract,
            KeyForContribution(contributionId),
            types.Contribution
        );
        if (err1) return { error: err1 };
        const contribution = contributionResult as any | null;
        if (!contribution) return { error: ErrRepuRing('contribution does not exist') };
        if (contribution.slashed) return { error: ErrRepuRing('contribution is slashed') };
        if (bytesEqual(sender, contribution.authorAddress)) {
            return { error: ErrRepuRing('sender cannot endorse own contribution') };
        }

        const [reads, err2] = await readMany(contract, [
            [KeyForProfile(sender), types.Profile],
            [KeyForProfile(contribution.authorAddress), types.Profile],
            [KeyForMember(contribution.circleId, sender), null],
            [KeyForContributionEndorsement(contributionId, sender), null]
        ]);
        if (err2) return { error: err2 };
        const [senderProfile, authorProfile, senderMember, previous] = reads;
        if (!senderProfile[0]) return { error: ErrRepuRing('sender must create a profile first') };
        const authorProfileData = authorProfile[0] as any | null;
        if (!authorProfileData) return { error: ErrRepuRing('contribution author must have a profile') };
        if (!senderMember[1]) return { error: ErrRepuRing('sender must be a circle member') };
        if (previous[1]) return { error: ErrRepuRing('sender already endorsed this contribution') };

        const reputation = toLong(authorProfileData.reputation).add(1);
        const updatedProfile = types.Profile.encode(
            types.Profile.create({ ...authorProfileData, reputation })
        ).finish();
        const endorsementCount = toLong(contribution.endorsementCount).add(1);
        const updatedContribution = types.Contribution.encode(
            types.Contribution.create({ ...contribution, endorsementCount })
        ).finish();
        const endorsement = types.Endorsement.encode(
            types.Endorsement.create({
                endorsementId,
                circleId: contribution.circleId,
                fromAddress: sender,
                targetAddress: contribution.authorAddress,
                tag: clean(msg.tag),
                message: clean(msg.message),
                slashed: false,
                contributionId
            })
        ).finish();
        return write(contract, [
            { key: KeyForProfile(contribution.authorAddress), value: updatedProfile },
            { key: KeyForContribution(contributionId), value: updatedContribution },
            { key: KeyForEndorsement(endorsementId), value: endorsement },
            { key: KeyForCircleEndorsement(contribution.circleId, endorsementId), value: oneByte() },
            { key: KeyForUserEndorsement(contribution.authorAddress, endorsementId), value: oneByte() },
            { key: KeyForContributionEndorsementIndex(contributionId, endorsementId), value: oneByte() },
            { key: KeyForContributionEndorsement(contributionId, sender), value: Buffer.from(endorsementId) }
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverMessageSlashEndorsement(contract: Contract, msg: any): Promise<any> {
        const sender = msg.senderAddress as Uint8Array;
        const endorsementId = clean(msg.endorsementId);
        const [endorsementResult, err1] = await readOne(
            contract,
            KeyForEndorsement(endorsementId),
            types.Endorsement
        );
        if (err1) return { error: err1 };
        const endorsement = endorsementResult as any | null;
        if (!endorsement) return { error: ErrRepuRing('endorsement does not exist') };
        if (endorsement.slashed) return { error: ErrRepuRing('endorsement already slashed') };

        const readEntries: [Uint8Array, any | null][] = [
            [KeyForCircle(endorsement.circleId), types.Circle],
            [KeyForProfile(endorsement.targetAddress), types.Profile]
        ];
        const contributionId = clean(endorsement.contributionId);
        if (contributionId) {
            readEntries.push([KeyForContribution(contributionId), types.Contribution]);
        }
        const [reads, err2] = await readMany(contract, readEntries);
        if (err2) return { error: err2 };
        const [circleResult, profileResult, contributionResult] = reads;
        const circle = circleResult[0] as any | null;
        const profile = profileResult[0] as any | null;
        const contribution = contributionResult?.[0] as any | null;
        if (!circle) return { error: ErrRepuRing('circle does not exist') };
        if (!bytesEqual(circle.creatorAddress, sender)) {
            return { error: ErrRepuRing('only circle creator/admin can slash endorsement') };
        }
        if (!profile) return { error: ErrRepuRing('target profile does not exist') };

        const reputation = toLong(profile.reputation).lessThan(2)
            ? Long.ZERO
            : toLong(profile.reputation).subtract(2);
        const updatedEndorsement = types.Endorsement.encode(
            types.Endorsement.create({
                ...endorsement,
                slashed: true,
                slashReason: clean(msg.reason)
            })
        ).finish();
        const updatedProfile = types.Profile.encode(
            types.Profile.create({ ...profile, reputation })
        ).finish();
        const sets = [
            { key: KeyForEndorsement(endorsementId), value: updatedEndorsement },
            { key: KeyForProfile(endorsement.targetAddress), value: updatedProfile }
        ];
        if (contributionId && contribution) {
            const endorsementCount = toLong(contribution.endorsementCount).equals(Long.ZERO)
                ? Long.ZERO
                : toLong(contribution.endorsementCount).subtract(1);
            sets.push({
                key: KeyForContribution(contributionId),
                value: types.Contribution.encode(
                    types.Contribution.create({ ...contribution, endorsementCount })
                ).finish()
            });
        }
        return write(contract, sets);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async DeliverMessageClaimRole(contract: Contract, msg: any): Promise<any> {
        const sender = msg.senderAddress as Uint8Array;
        const circleId = clean(msg.circleId);
        const [reads, err] = await readMany(contract, [
            [KeyForProfile(sender), types.Profile],
            [KeyForMember(circleId, sender), null]
        ]);
        if (err) return { error: err };
        const [profileResult, memberResult] = reads;
        const profile = profileResult[0] as any | null;
        if (!profile) return { error: ErrRepuRing('sender must create a profile first') };
        if (!memberResult[1]) return { error: ErrRepuRing('sender is not a circle member') };

        const reputation = toLong(profile.reputation);
        const role = roleForReputation(reputation);
        const roleBytes = types.Role.encode(
            types.Role.create({ circleId, address: sender, role, reputation })
        ).finish();
        return write(contract, [{ key: KeyForRole(circleId, sender), value: roleBytes }]);
    }
}

const accountPrefix = Buffer.from([1]);
const poolPrefix = Buffer.from([2]);
const paramsPrefix = Buffer.from([7]);
const profilePrefix = Buffer.from([80]);
const usernamePrefix = Buffer.from([81]);
const circlePrefix = Buffer.from([82]);
const memberPrefix = Buffer.from([83]);
const rolePrefix = Buffer.from([84]);
const endorsementPrefix = Buffer.from([85]);
const circleEndorsementPrefix = Buffer.from([86]);
const userEndorsementPrefix = Buffer.from([87]);
const pairEndorsementPrefix = Buffer.from([88]);
const contributionPrefix = Buffer.from([70]);
const circleContributionPrefix = Buffer.from([71]);
const userContributionPrefix = Buffer.from([72]);
const contributionEndorsementPrefix = Buffer.from([73]);
const contributionEndorsementIndexPrefix = Buffer.from([74]);

export function KeyForAccount(addr: Uint8Array): Uint8Array {
    return JoinLenPrefix(accountPrefix, Buffer.from(addr));
}

export function KeyForFeeParams(): Uint8Array {
    return JoinLenPrefix(paramsPrefix, Buffer.from('/f/'));
}

export function KeyForFeePool(chainId: Long): Uint8Array {
    return JoinLenPrefix(poolPrefix, formatUint64(chainId));
}

export function KeyForProfile(addr: Uint8Array): Uint8Array {
    return JoinLenPrefix(profilePrefix, Buffer.from(addr));
}

export function KeyForUsername(username: string): Uint8Array {
    return JoinLenPrefix(usernamePrefix, Buffer.from(username.toLowerCase()));
}

export function KeyForCircle(circleId: string): Uint8Array {
    return JoinLenPrefix(circlePrefix, Buffer.from(circleId));
}

export function KeyForMember(circleId: string, addr: Uint8Array): Uint8Array {
    return JoinLenPrefix(memberPrefix, Buffer.from(circleId), Buffer.from(addr));
}

export function KeyForRole(circleId: string, addr: Uint8Array): Uint8Array {
    return JoinLenPrefix(rolePrefix, Buffer.from(circleId), Buffer.from(addr));
}

export function KeyForEndorsement(endorsementId: string): Uint8Array {
    return JoinLenPrefix(endorsementPrefix, Buffer.from(endorsementId));
}

export function KeyForCircleEndorsement(circleId: string, endorsementId: string): Uint8Array {
    return JoinLenPrefix(circleEndorsementPrefix, Buffer.from(circleId), Buffer.from(endorsementId));
}

export function KeyForUserEndorsement(addr: Uint8Array, endorsementId: string): Uint8Array {
    return JoinLenPrefix(userEndorsementPrefix, Buffer.from(addr), Buffer.from(endorsementId));
}

export function KeyForPairEndorsement(
    circleId: string,
    sender: Uint8Array,
    target: Uint8Array
): Uint8Array {
    return JoinLenPrefix(
        pairEndorsementPrefix,
        Buffer.from(circleId),
        Buffer.from(sender),
        Buffer.from(target)
    );
}

export function KeyForContribution(contributionId: string): Uint8Array {
    return JoinLenPrefix(contributionPrefix, Buffer.from(contributionId));
}

export function KeyForCircleContribution(circleId: string, contributionId: string): Uint8Array {
    return JoinLenPrefix(circleContributionPrefix, Buffer.from(circleId), Buffer.from(contributionId));
}

export function KeyForUserContribution(addr: Uint8Array, contributionId: string): Uint8Array {
    return JoinLenPrefix(userContributionPrefix, Buffer.from(addr), Buffer.from(contributionId));
}

export function KeyForContributionEndorsement(contributionId: string, sender: Uint8Array): Uint8Array {
    return JoinLenPrefix(contributionEndorsementPrefix, Buffer.from(contributionId), Buffer.from(sender));
}

export function KeyForContributionEndorsementIndex(contributionId: string, endorsementId: string): Uint8Array {
    return JoinLenPrefix(contributionEndorsementIndexPrefix, Buffer.from(contributionId), Buffer.from(endorsementId));
}

function ErrRepuRing(message: string): IPluginError {
    return NewError(100, moduleName, message);
}

function signerResponse(signer: Uint8Array, recipient?: Uint8Array): any {
    return {
        recipient,
        authorizedSigners: [signer]
    };
}

function isAddress(addr: Uint8Array | undefined | null): boolean {
    return !!addr && addr.length === 20;
}

function clean(v: unknown): string {
    return String(v ?? '').trim();
}

function oneByte(): Uint8Array {
    return Buffer.from([1]);
}

function bytesEqual(a?: Uint8Array | null, b?: Uint8Array | null): boolean {
    return !!a && !!b && Buffer.from(a).equals(Buffer.from(b));
}

function compareBytes(a: Uint8Array, b: Uint8Array): number {
    return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function makeEndorsementId(circleId: string, sender: Uint8Array, target: Uint8Array): string {
    return createHash('sha256')
        .update(circleId)
        .update(Buffer.from([0]))
        .update(Buffer.from(sender))
        .update(Buffer.from([0]))
        .update(Buffer.from(target))
        .digest('hex')
        .slice(0, 32);
}

function makeContributionEndorsementId(contributionId: string, sender: Uint8Array): string {
    return createHash('sha256')
        .update('contribution')
        .update(Buffer.from([0]))
        .update(contributionId)
        .update(Buffer.from([0]))
        .update(Buffer.from(sender))
        .digest('hex')
        .slice(0, 32);
}

function roleForReputation(reputation: Long): string {
    if (reputation.greaterThanOrEqual(30)) return 'Circle Leader';
    if (reputation.greaterThanOrEqual(15)) return 'Core Member';
    if (reputation.greaterThanOrEqual(5)) return 'Trusted';
    return 'Newbie';
}

function toLong(value: Long | number | undefined | null): Long {
    if (Long.isLong(value)) return value;
    return Long.fromNumber(Number(value || 0), true);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readOne(contract: Contract, key: Uint8Array, decoder: any): Promise<[any, IPluginError | null]> {
    const [result, err] = await readMany(contract, [[key, decoder]]);
    return [result[0]?.[0] || null, err];
}

async function readMany(
    contract: Contract,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entries: [Uint8Array, any | null][]
): Promise<[Array<[any | null, Uint8Array | null]>, IPluginError | null]> {
    const queries = entries.map(([key], i) => ({
        queryId: Long.fromNumber(i + 1),
        key
    }));
    const [response, readErr] = await contract.plugin.StateRead(contract, { keys: queries });
    if (readErr) return [[], readErr];
    if (response?.error) return [[], response.error];

    const values = new Map<string, Uint8Array>();
    for (const resp of response?.results || []) {
        const qid = resp.queryId as Long;
        const rawValue = resp.entries?.[0]?.value || null;
        const value = rawValue && rawValue.length > 0 ? rawValue : null;
        if (value) values.set(qid.toString(), value);
    }

    const decoded: Array<[any | null, Uint8Array | null]> = [];
    for (let i = 0; i < entries.length; i++) {
        const decoder = entries[i][1];
        const value = values.get(String(i + 1)) || null;
        if (!value || !decoder) {
            decoded.push([null, value]);
            continue;
        }
        const [obj, err] = Unmarshal(value, decoder);
        if (err) return [[], err];
        decoded.push([obj, value]);
    }
    return [decoded, null];
}

async function write(
    contract: Contract,
    sets: Array<{ key: Uint8Array; value: Uint8Array }>
): Promise<any> {
    const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, { sets });
    if (writeErr) return { error: writeErr };
    if (writeResp?.error) return { error: writeResp.error };
    return {};
}

function formatUint64(u: Long): Buffer {
    const b = Buffer.alloc(8);
    b.writeBigUInt64BE(BigInt(u.toString()));
    return b;
}
