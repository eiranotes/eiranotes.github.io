# eiranotes.github.io

`app.adeliedraw.com` 루트에서 서비스되는 안내 페이지입니다.

이 저장소의 역할은 두 가지입니다.

1. `CNAME` 파일로 사용자 지정 도메인 `app.adeliedraw.com`을 GitHub Pages에 연결합니다.
   이 설정 덕분에 같은 계정의 프로젝트 사이트가 `app.adeliedraw.com/<저장소 이름>`으로 열립니다.
   (예: [`adeliepages`](https://github.com/eiranotes/adeliepages) → `app.adeliedraw.com/adeliepages`)
2. 루트 주소에 앱 목록을 보여줍니다.

## DNS

도메인 호스팅에서 `app` 레코드가 **`eiranotes.github.io`** 를 가리켜야 합니다.

```
app   CNAME   eiranotes.github.io.
```

## 앱을 추가할 때

`index.html`의 `.apps` 목록에 항목을 하나 더 넣고, 해당 프로젝트 저장소를 공개로 두면 됩니다.
프로젝트 저장소에는 CNAME 파일을 넣지 않습니다.
