# eiranotes.github.io

`app.adeliedraw.com` 루트에서 서비스되는 안내 페이지입니다.

이 저장소의 역할은 두 가지입니다.

1. `CNAME` 파일로 사용자 지정 도메인 `app.adeliedraw.com`을 GitHub Pages에 연결합니다.
   이 설정 덕분에 같은 계정의 프로젝트 사이트가 `app.adeliedraw.com/<저장소 이름>`으로 열립니다.
   (예: [`pages`](https://github.com/eiranotes/pages) → `app.adeliedraw.com/pages`)
2. 루트 주소에 앱 목록을 보여줍니다.

## DNS

도메인 호스팅에서 `app` 레코드가 **`eiranotes.github.io`** 를 가리켜야 합니다.

```
app   CNAME   eiranotes.github.io.
```

## 앱을 추가할 때

`index.html`의 `.drawer-cards` 목록에 색인 카드(`<li><a class="card ad-cut">…`)를 하나 더 넣고,
청구기호(`AP · 02` …)를 이어서 붙입니다. 실제로 공개된 앱만 넣습니다.
해당 프로젝트 저장소를 공개로 두면 `app.adeliedraw.com/<저장소 이름>/`으로 열립니다.
프로젝트 저장소에는 CNAME 파일을 넣지 않습니다.

이 계정의 공개 저장소에서 Pages를 켜면 무엇이든 `app.adeliedraw.com/<이름>/`이 됩니다.
앱이 아닌 실험물·개인 페이지는 Pages를 켜지 않습니다.

## 디자인

토큰·브랜드 바·푸터·404는 정본 `adelie-web-design`에서 `brand/`로 복사합니다.
`brand/` 파일은 직접 고치지 않습니다. 정본에서 고친 뒤 `python3 tools/sync.py --write app-root`.
`404.html`은 정본의 `templates/404.html`에서 만듭니다.
