package rpc

import (
	"encoding/hex"
	"fmt"
	"net/http"
	"sort"
	"strings"

	"github.com/canopy-network/canopy/fsm"
	"github.com/canopy-network/canopy/lib"
	"github.com/julienschmidt/httprouter"
)

const (
	repuringProfilePrefix            byte = 80
	repuringCirclePrefix             byte = 82
	repuringRolePrefix               byte = 84
	repuringEndorsementPrefix        byte = 85
	repuringCircleEndorsementPrefix  byte = 86
	repuringUserEndorsementPrefix    byte = 87
	repuringContributionPrefix       byte = 70
	repuringCircleContributionPrefix byte = 71
	repuringUserContributionPrefix   byte = 72
)

type repuringAddressRequest struct {
	Height  uint64       `json:"height"`
	Address lib.HexBytes `json:"address"`
}

func (r *repuringAddressRequest) GetHeight() uint64 { return r.Height }

type repuringCircleRequest struct {
	Height   uint64 `json:"height"`
	CircleID string `json:"circleId"`
}

func (r *repuringCircleRequest) GetHeight() uint64 { return r.Height }

type repuringRoleRequest struct {
	Height   uint64       `json:"height"`
	CircleID string       `json:"circleId"`
	Address  lib.HexBytes `json:"address"`
}

func (r *repuringRoleRequest) GetHeight() uint64 { return r.Height }

type repuringContributionRequest struct {
	Height         uint64 `json:"height"`
	ContributionID string `json:"contributionId"`
}

func (r *repuringContributionRequest) GetHeight() uint64 { return r.Height }

type repuringProfileView struct {
	Address    string `json:"address"`
	Username   string `json:"username"`
	Bio        string `json:"bio"`
	AvatarURL  string `json:"avatarUrl"`
	Reputation uint64 `json:"reputation"`
}

type repuringCircleView struct {
	CircleID       string   `json:"circleId"`
	Name           string   `json:"name"`
	Description    string   `json:"description"`
	CreatorAddress string   `json:"creatorAddress"`
	Members        []string `json:"members"`
}

type repuringEndorsementView struct {
	EndorsementID  string `json:"endorsementId"`
	CircleID       string `json:"circleId"`
	FromAddress    string `json:"fromAddress"`
	TargetAddress  string `json:"targetAddress"`
	Tag            string `json:"tag"`
	Message        string `json:"message"`
	Slashed        bool   `json:"slashed"`
	SlashReason    string `json:"slashReason"`
	ContributionID string `json:"contributionId"`
}

type repuringContributionView struct {
	ContributionID   string `json:"contributionId"`
	CircleID         string `json:"circleId"`
	AuthorAddress    string `json:"authorAddress"`
	AuthorUsername   string `json:"authorUsername"`
	Title            string `json:"title"`
	Description      string `json:"description"`
	ProofURL         string `json:"proofUrl"`
	Category         string `json:"category"`
	EndorsementCount uint64 `json:"endorsementCount"`
	Slashed          bool   `json:"slashed"`
}

type repuringRoleView struct {
	CircleID    string `json:"circleId"`
	Address     string `json:"address"`
	Role        string `json:"role"`
	Reputation  uint64 `json:"reputation"`
	ClaimedRole bool   `json:"claimedRole"`
}

type repuringLeaderboardRow struct {
	Address    string `json:"address"`
	Username   string `json:"username"`
	Reputation uint64 `json:"reputation"`
	Role       string `json:"role"`
}

type repuringProfileRecord struct {
	Address    []byte
	Username   string
	Bio        string
	AvatarURL  string
	Reputation uint64
}

type repuringCircleRecord struct {
	CircleID       string
	Name           string
	Description    string
	CreatorAddress []byte
	Members        [][]byte
}

type repuringEndorsementRecord struct {
	EndorsementID  string
	CircleID       string
	FromAddress    []byte
	TargetAddress  []byte
	Tag            string
	Message        string
	Slashed        bool
	SlashReason    string
	ContributionID string
}

type repuringContributionRecord struct {
	ContributionID   string
	CircleID         string
	AuthorAddress    []byte
	Title            string
	Description      string
	ProofURL         string
	Category         string
	EndorsementCount uint64
	Slashed          bool
}

type repuringRoleRecord struct {
	CircleID   string
	Address    []byte
	Role       string
	Reputation uint64
}

// RepuRingProfile reads the onchain Social-Fi profile stored by CreateProfileTx.
func (s *Server) RepuRingProfile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringAddressRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		profile, err := repuringGetProfile(state, req.Address)
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		if profile == nil {
			return errPayload(fmt.Errorf("repuring profile not found")), http.StatusNotFound
		}
		return profile.view(), http.StatusOK
	})
}

// RepuRingCircle reads a social circle created by CreateCircleTx.
func (s *Server) RepuRingCircle(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringCircleRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		circle, err := repuringGetCircle(state, req.CircleID)
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		if circle == nil {
			return errPayload(fmt.Errorf("repuring circle not found")), http.StatusNotFound
		}
		return circle.view(), http.StatusOK
	})
}

// RepuRingCircleMembers returns the member addresses in a circle.
func (s *Server) RepuRingCircleMembers(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringCircleRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		circle, err := repuringGetCircle(state, req.CircleID)
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		if circle == nil {
			return errPayload(fmt.Errorf("repuring circle not found")), http.StatusNotFound
		}
		return map[string]any{"circleId": circle.CircleID, "members": hexAddresses(circle.Members)}, http.StatusOK
	})
}

// RepuRingReputation returns the current reputation score for an address.
func (s *Server) RepuRingReputation(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringAddressRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		profile, err := repuringGetProfile(state, req.Address)
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		if profile == nil {
			return errPayload(fmt.Errorf("repuring profile not found")), http.StatusNotFound
		}
		return map[string]any{"address": bytesToHex(profile.Address), "reputation": profile.Reputation}, http.StatusOK
	})
}

// RepuRingRole reads the role claimed by ClaimRoleTx, or derives the next claimable label.
func (s *Server) RepuRingRole(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringRoleRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		role, err := repuringGetRole(state, req.CircleID, req.Address)
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		if role != nil {
			return role.view(true), http.StatusOK
		}
		profile, err := repuringGetProfile(state, req.Address)
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		if profile == nil {
			return errPayload(fmt.Errorf("repuring profile not found")), http.StatusNotFound
		}
		return repuringRoleView{
			CircleID:    req.CircleID,
			Address:     bytesToHex(req.Address),
			Role:        repuringRoleForReputation(profile.Reputation),
			Reputation:  profile.Reputation,
			ClaimedRole: false,
		}, http.StatusOK
	})
}

// RepuRingEndorsementsForUser lists endorsements targeting an address.
func (s *Server) RepuRingEndorsementsForUser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringAddressRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		items, err := repuringGetIndexedEndorsements(state, repuringKey(repuringUserEndorsementPrefix, req.Address))
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		return endorsementViews(items), http.StatusOK
	})
}

// RepuRingEndorsementsInCircle lists endorsements made inside a circle.
func (s *Server) RepuRingEndorsementsInCircle(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringCircleRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		items, err := repuringGetIndexedEndorsements(state, repuringKey(repuringCircleEndorsementPrefix, []byte(req.CircleID)))
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		return endorsementViews(items), http.StatusOK
	})
}

// RepuRingContribution reads a contribution proof by id.
func (s *Server) RepuRingContribution(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringContributionRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		contribution, err := repuringGetContribution(state, req.ContributionID)
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		if contribution == nil {
			return errPayload(fmt.Errorf("repuring contribution not found")), http.StatusNotFound
		}
		return contribution.view(state), http.StatusOK
	})
}

// RepuRingContributionsInCircle lists contribution proofs posted in a circle.
func (s *Server) RepuRingContributionsInCircle(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringCircleRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		items, err := repuringGetIndexedContributions(state, repuringKey(repuringCircleContributionPrefix, []byte(req.CircleID)))
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		return contributionViews(state, items), http.StatusOK
	})
}

// RepuRingContributionsForUser lists contribution proofs authored by an address.
func (s *Server) RepuRingContributionsForUser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringAddressRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		items, err := repuringGetIndexedContributions(state, repuringKey(repuringUserContributionPrefix, req.Address))
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		return contributionViews(state, items), http.StatusOK
	})
}

// RepuRingLeaderboard ranks circle members by their committed profile reputation.
func (s *Server) RepuRingLeaderboard(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req := new(repuringCircleRequest)
	s.repuringRead(w, r, req, func(state *fsm.StateMachine) (any, int) {
		circle, err := repuringGetCircle(state, req.CircleID)
		if err != nil {
			return errPayload(err), http.StatusBadRequest
		}
		if circle == nil {
			return errPayload(fmt.Errorf("repuring circle not found")), http.StatusNotFound
		}
		rows := make([]repuringLeaderboardRow, 0, len(circle.Members))
		for _, member := range circle.Members {
			profile, err := repuringGetProfile(state, member)
			if err != nil {
				return errPayload(err), http.StatusBadRequest
			}
			if profile == nil {
				continue
			}
			role, _ := repuringGetRole(state, circle.CircleID, member)
			roleName := repuringRoleForReputation(profile.Reputation)
			if role != nil && role.Role != "" {
				roleName = role.Role
			}
			rows = append(rows, repuringLeaderboardRow{
				Address:    bytesToHex(member),
				Username:   profile.Username,
				Reputation: profile.Reputation,
				Role:       roleName,
			})
		}
		sort.Slice(rows, func(i, j int) bool {
			if rows[i].Reputation != rows[j].Reputation {
				return rows[i].Reputation > rows[j].Reputation
			}
			if rows[i].Username != rows[j].Username {
				return rows[i].Username < rows[j].Username
			}
			return rows[i].Address < rows[j].Address
		})
		return rows, http.StatusOK
	})
}

func (s *Server) repuringRead(w http.ResponseWriter, r *http.Request, req queryWithHeight, callback func(*fsm.StateMachine) (any, int)) {
	if ok := unmarshal(w, r, req); !ok {
		return
	}
	err := s.readOnlyState(req.GetHeight(), func(state *fsm.StateMachine) lib.ErrorI {
		payload, code := callback(state)
		write(w, payload, code)
		return nil
	})
	if err != nil {
		write(w, errPayload(err), http.StatusBadRequest)
	}
}

func repuringGetProfile(state *fsm.StateMachine, address []byte) (*repuringProfileRecord, error) {
	if len(address) == 0 {
		return nil, fmt.Errorf("address must not be empty")
	}
	bz, err := state.Get(repuringKey(repuringProfilePrefix, address))
	if err != nil {
		return nil, err
	}
	if len(bz) == 0 {
		return nil, nil
	}
	return decodeRepuringProfile(bz)
}

func repuringGetCircle(state *fsm.StateMachine, circleID string) (*repuringCircleRecord, error) {
	circleID = strings.TrimSpace(circleID)
	if circleID == "" {
		return nil, fmt.Errorf("circleId must not be empty")
	}
	bz, err := state.Get(repuringKey(repuringCirclePrefix, []byte(circleID)))
	if err != nil {
		return nil, err
	}
	if len(bz) == 0 {
		return nil, nil
	}
	return decodeRepuringCircle(bz)
}

func repuringGetRole(state *fsm.StateMachine, circleID string, address []byte) (*repuringRoleRecord, error) {
	circleID = strings.TrimSpace(circleID)
	if circleID == "" {
		return nil, fmt.Errorf("circleId must not be empty")
	}
	if len(address) == 0 {
		return nil, fmt.Errorf("address must not be empty")
	}
	bz, err := state.Get(repuringKey(repuringRolePrefix, []byte(circleID), address))
	if err != nil {
		return nil, err
	}
	if len(bz) == 0 {
		return nil, nil
	}
	return decodeRepuringRole(bz)
}

func repuringGetEndorsement(state *fsm.StateMachine, endorsementID string) (*repuringEndorsementRecord, error) {
	endorsementID = strings.TrimSpace(endorsementID)
	if endorsementID == "" {
		return nil, fmt.Errorf("endorsement id must not be empty")
	}
	bz, err := state.Get(repuringKey(repuringEndorsementPrefix, []byte(endorsementID)))
	if err != nil {
		return nil, err
	}
	if len(bz) == 0 {
		return nil, nil
	}
	return decodeRepuringEndorsement(bz)
}

func repuringGetContribution(state *fsm.StateMachine, contributionID string) (*repuringContributionRecord, error) {
	contributionID = strings.TrimSpace(contributionID)
	if contributionID == "" {
		return nil, fmt.Errorf("contribution id must not be empty")
	}
	bz, err := state.Get(repuringKey(repuringContributionPrefix, []byte(contributionID)))
	if err != nil {
		return nil, err
	}
	if len(bz) == 0 {
		return nil, nil
	}
	return decodeRepuringContribution(bz)
}

func repuringGetIndexedEndorsements(state *fsm.StateMachine, prefix []byte) ([]*repuringEndorsementRecord, error) {
	it, err := state.Iterator(prefix)
	if err != nil {
		return nil, err
	}
	defer it.Close()
	items := make([]*repuringEndorsementRecord, 0)
	for ; it.Valid(); it.Next() {
		segments := lib.DecodeLengthPrefixed(it.Key())
		if len(segments) < 3 {
			return nil, fmt.Errorf("invalid repuring endorsement index key")
		}
		endorsement, err := repuringGetEndorsement(state, string(segments[len(segments)-1]))
		if err != nil {
			return nil, err
		}
		if endorsement != nil {
			items = append(items, endorsement)
		}
	}
	sort.Slice(items, func(i, j int) bool {
		return items[i].EndorsementID < items[j].EndorsementID
	})
	return items, nil
}

func repuringGetIndexedContributions(state *fsm.StateMachine, prefix []byte) ([]*repuringContributionRecord, error) {
	it, err := state.Iterator(prefix)
	if err != nil {
		return nil, err
	}
	defer it.Close()
	items := make([]*repuringContributionRecord, 0)
	for ; it.Valid(); it.Next() {
		segments := lib.DecodeLengthPrefixed(it.Key())
		if len(segments) < 3 {
			return nil, fmt.Errorf("invalid repuring contribution index key")
		}
		contribution, err := repuringGetContribution(state, string(segments[len(segments)-1]))
		if err != nil {
			return nil, err
		}
		if contribution != nil {
			items = append(items, contribution)
		}
	}
	sort.Slice(items, func(i, j int) bool {
		if items[i].EndorsementCount != items[j].EndorsementCount {
			return items[i].EndorsementCount > items[j].EndorsementCount
		}
		return items[i].ContributionID < items[j].ContributionID
	})
	return items, nil
}

func (p *repuringProfileRecord) view() repuringProfileView {
	return repuringProfileView{
		Address:    bytesToHex(p.Address),
		Username:   p.Username,
		Bio:        p.Bio,
		AvatarURL:  p.AvatarURL,
		Reputation: p.Reputation,
	}
}

func (c *repuringCircleRecord) view() repuringCircleView {
	return repuringCircleView{
		CircleID:       c.CircleID,
		Name:           c.Name,
		Description:    c.Description,
		CreatorAddress: bytesToHex(c.CreatorAddress),
		Members:        hexAddresses(c.Members),
	}
}

func (e *repuringEndorsementRecord) view() repuringEndorsementView {
	return repuringEndorsementView{
		EndorsementID:  e.EndorsementID,
		CircleID:       e.CircleID,
		FromAddress:    bytesToHex(e.FromAddress),
		TargetAddress:  bytesToHex(e.TargetAddress),
		Tag:            e.Tag,
		Message:        e.Message,
		Slashed:        e.Slashed,
		SlashReason:    e.SlashReason,
		ContributionID: e.ContributionID,
	}
}

func (c *repuringContributionRecord) view(state *fsm.StateMachine) repuringContributionView {
	username := ""
	if profile, err := repuringGetProfile(state, c.AuthorAddress); err == nil && profile != nil {
		username = profile.Username
	}
	return repuringContributionView{
		ContributionID:   c.ContributionID,
		CircleID:         c.CircleID,
		AuthorAddress:    bytesToHex(c.AuthorAddress),
		AuthorUsername:   username,
		Title:            c.Title,
		Description:      c.Description,
		ProofURL:         c.ProofURL,
		Category:         c.Category,
		EndorsementCount: c.EndorsementCount,
		Slashed:          c.Slashed,
	}
}

func (r *repuringRoleRecord) view(claimed bool) repuringRoleView {
	return repuringRoleView{
		CircleID:    r.CircleID,
		Address:     bytesToHex(r.Address),
		Role:        r.Role,
		Reputation:  r.Reputation,
		ClaimedRole: claimed,
	}
}

func endorsementViews(records []*repuringEndorsementRecord) []repuringEndorsementView {
	views := make([]repuringEndorsementView, 0, len(records))
	for _, record := range records {
		views = append(views, record.view())
	}
	return views
}

func contributionViews(state *fsm.StateMachine, records []*repuringContributionRecord) []repuringContributionView {
	views := make([]repuringContributionView, 0, len(records))
	for _, record := range records {
		views = append(views, record.view(state))
	}
	return views
}

func repuringKey(prefix byte, parts ...[]byte) []byte {
	all := make([][]byte, 0, len(parts)+1)
	all = append(all, []byte{prefix})
	all = append(all, parts...)
	return lib.JoinLenPrefix(all...)
}

func hexAddresses(addresses [][]byte) []string {
	out := make([]string, 0, len(addresses))
	for _, address := range addresses {
		out = append(out, bytesToHex(address))
	}
	return out
}

func bytesToHex(bz []byte) string {
	return hex.EncodeToString(bz)
}

func errPayload(err error) map[string]string {
	return map[string]string{"error": err.Error()}
}

func repuringRoleForReputation(reputation uint64) string {
	switch {
	case reputation >= 30:
		return "Circle Leader"
	case reputation >= 15:
		return "Core Member"
	case reputation >= 5:
		return "Trusted"
	default:
		return "Newbie"
	}
}

func decodeRepuringProfile(bz []byte) (*repuringProfileRecord, error) {
	msg, err := decodeProtoFields(bz)
	if err != nil {
		return nil, err
	}
	return &repuringProfileRecord{
		Address:    msg.bytes(1),
		Username:   string(msg.bytes(2)),
		Bio:        string(msg.bytes(3)),
		AvatarURL:  string(msg.bytes(4)),
		Reputation: msg.uint64(5),
	}, nil
}

func decodeRepuringCircle(bz []byte) (*repuringCircleRecord, error) {
	msg, err := decodeProtoFields(bz)
	if err != nil {
		return nil, err
	}
	return &repuringCircleRecord{
		CircleID:       string(msg.bytes(1)),
		Name:           string(msg.bytes(2)),
		Description:    string(msg.bytes(3)),
		CreatorAddress: msg.bytes(4),
		Members:        msg.repeatedBytes(5),
	}, nil
}

func decodeRepuringEndorsement(bz []byte) (*repuringEndorsementRecord, error) {
	msg, err := decodeProtoFields(bz)
	if err != nil {
		return nil, err
	}
	return &repuringEndorsementRecord{
		EndorsementID:  string(msg.bytes(1)),
		CircleID:       string(msg.bytes(2)),
		FromAddress:    msg.bytes(3),
		TargetAddress:  msg.bytes(4),
		Tag:            string(msg.bytes(5)),
		Message:        string(msg.bytes(6)),
		Slashed:        msg.uint64(7) != 0,
		SlashReason:    string(msg.bytes(8)),
		ContributionID: string(msg.bytes(9)),
	}, nil
}

func decodeRepuringContribution(bz []byte) (*repuringContributionRecord, error) {
	msg, err := decodeProtoFields(bz)
	if err != nil {
		return nil, err
	}
	return &repuringContributionRecord{
		ContributionID:   string(msg.bytes(1)),
		CircleID:         string(msg.bytes(2)),
		AuthorAddress:    msg.bytes(3),
		Title:            string(msg.bytes(4)),
		Description:      string(msg.bytes(5)),
		ProofURL:         string(msg.bytes(6)),
		Category:         string(msg.bytes(7)),
		EndorsementCount: msg.uint64(8),
		Slashed:          msg.uint64(9) != 0,
	}, nil
}

func decodeRepuringRole(bz []byte) (*repuringRoleRecord, error) {
	msg, err := decodeProtoFields(bz)
	if err != nil {
		return nil, err
	}
	return &repuringRoleRecord{
		CircleID:   string(msg.bytes(1)),
		Address:    msg.bytes(2),
		Role:       string(msg.bytes(3)),
		Reputation: msg.uint64(4),
	}, nil
}

type protoFieldSet map[int][][]byte

func (p protoFieldSet) bytes(field int) []byte {
	values := p[field]
	if len(values) == 0 {
		return nil
	}
	return values[len(values)-1]
}

func (p protoFieldSet) repeatedBytes(field int) [][]byte {
	return p[field]
}

func (p protoFieldSet) uint64(field int) uint64 {
	value := p.bytes(field)
	if len(value) == 0 {
		return 0
	}
	got, _, ok := readProtoVarint(value, 0)
	if !ok {
		return 0
	}
	return got
}

func decodeProtoFields(bz []byte) (protoFieldSet, error) {
	fields := make(protoFieldSet)
	for offset := 0; offset < len(bz); {
		key, next, ok := readProtoVarint(bz, offset)
		if !ok {
			return nil, fmt.Errorf("invalid protobuf field key")
		}
		offset = next
		field := int(key >> 3)
		wire := int(key & 7)
		switch wire {
		case 0:
			value, after, ok := readProtoVarint(bz, offset)
			if !ok {
				return nil, fmt.Errorf("invalid protobuf varint")
			}
			fields[field] = append(fields[field], encodeProtoVarint(value))
			offset = after
		case 2:
			length, after, ok := readProtoVarint(bz, offset)
			if !ok || length > uint64(len(bz)-after) {
				return nil, fmt.Errorf("invalid protobuf length-delimited field")
			}
			value := make([]byte, int(length))
			copy(value, bz[after:after+int(length)])
			fields[field] = append(fields[field], value)
			offset = after + int(length)
		default:
			return nil, fmt.Errorf("unsupported protobuf wire type %d", wire)
		}
	}
	return fields, nil
}

func readProtoVarint(bz []byte, offset int) (uint64, int, bool) {
	var value uint64
	for shift := uint(0); offset < len(bz) && shift < 64; shift += 7 {
		b := bz[offset]
		offset++
		value |= uint64(b&0x7f) << shift
		if b < 0x80 {
			return value, offset, true
		}
	}
	return 0, offset, false
}

func encodeProtoVarint(value uint64) []byte {
	out := make([]byte, 0, 10)
	for value >= 0x80 {
		out = append(out, byte(value&0x7f)|0x80)
		value >>= 7
	}
	return append(out, byte(value))
}
