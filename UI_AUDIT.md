# UI Audit

Source screenshots: `ui-screenshots/`

## Van de layout

- **P0 - Mobile page scale qua lon.** Header, hero, cards va buttons dang gan desktop scale tren viewport 390px, lam moi man hinh chi thay it noi dung. Overview, Review Work va Leaderboard co cam giac bi zoom.
- **P0 - Mobile content bi bo trong nen hep.** Page container co teal band va padding ngang lon, tao hai dai den hai ben va lam card bi chat.
- **P1 - Desktop shell thieu nhip noi dung.** Sidebar/topbar on, nhung page content co nhieu card full-width voi density chua dong nhat giua Overview, RepuRing pages va My Account.
- **P1 - My Account lech he layout.** Page nay dung header va card scale khac nhom RepuRing; tren mobile card dau qua lon va nested card day.
- **P1 - Repeated status/context cards chiem qua nhieu dien tich mobile.** Active Wallet va Community Context lap o nhieu page nhung qua cao, day tac vu chinh xuong sau.

## Van de spacing

- **P0 - Mobile spacing qua rong.** Padding card/section tren mobile lam UI nang va gay scroll dai.
- **P1 - Gap doc giua cac section lon va deu nhau qua muc.** Cac RepuRing page dung cung mot khoang cach cho hero, context va content nen priority noi dung chua ro.
- **P1 - Button group trong hero mobile thieu compact layout.** Buttons cao, rong va gap lon; Overview hero co 3 CTA nen block rat cao.
- **P2 - Desktop card inner spacing hoi du.** Desktop nhin sach nhung nhieu panel co padding lon hon luong noi dung thuc te.

## Van de typography

- **P0 - Mobile H1 qua lon.** H1 tren 390px lam headline gay nhieu dong, chiem nhieu first viewport.
- **P0 - Mobile body text va line-height qua cao.** Hero copy va helper copy de doc nhung density thap.
- **P1 - Typography hierarchy chua tach ro page title, card title va metric title.** Mot so card title dung weight/size gan voi page heading.
- **P1 - Long technical strings thieu containment dong nhat.** Address/public key text tren mobile co luc wrap lam card cao bat thuong.

## Van de mau sac

- **P1 - Palette qua dominant teal/green.** Nhieu hero/card/status cung teal gradient lam cac page doc kha giong nhau va thieu phan cap.
- **P1 - Borders va filled surfaces hoi nang tren mobile.** Card vien sang + nen gradient tao cam giac moi block deu la hero.
- **P2 - Danger/security panel trong My Account dung tone tot nhung hoi manh so voi phan con lai.**
- **P2 - Cyan primary CTA noi tot, nhung secondary buttons can hierarchy ro hon giua neutral card va hero.**

## Component can redesign

- **Page hero / PageHeader cards:** responsive scale nho hon tren mobile, giam padding va font-size.
- **Page container / layout shell:** compact mobile padding, giam teal band hoac gioi han background tot hon.
- **Info/status cards:** `Active Wallet`, `Community Context`, readiness/status panels can compact variant mobile.
- **Card system:** chuan hoa border radius, padding, background va nested card rules.
- **Buttons/inputs:** compact mobile height, tranh button qua lon trong card.
- **My Account wallet card:** giam nested-card cam giac qua nang tren mobile, kiem soat address text.

## Muc uu tien sua

1. **P0:** Mobile typography scale, mobile page/container padding, hero/card padding.
2. **P1:** Layout shell desktop/mobile rhythm, card system va status/context card density.
3. **P1:** Button/input/table state consistency.
4. **P2:** Color palette refinement, danger panel tone, minor visual polish.

## Batch plan da thuc hien

1. **Design tokens:** dieu chinh surface color, spacing va typography scale cho RepuRing primitives.
2. **Layout shell:** compact mobile topbar/sidebar/page container rhythm.
3. **Card system:** chuan hoa card padding/background/radius va compact mobile cho shared RepuRing cards.
4. **Button/input/table states:** compact button/input/select, table container va podium cards.
5. **Responsive mobile:** ra soat lai mobile 390px, giam scale My Account va wallet cards.

## Guardrails

- Khong doi business logic.
- Khong doi RPC/protocol/backend.
- Sau moi batch chay build.
- `npm run lint` khong chay duoc vi project chua co script `lint`.
