// 📌 코드 흐름 설명 (단계별)
// 1️⃣ 문서 로드 완료 후 실행 준비
// 웹 페이지가 완전히 로드되면 JavaScript 코드가 실행될 준비를 합니다.
// $(document).ready(function() {...}) 를 사용하여 초기 설정을 합니다.
// 2️⃣ 검색 버튼 클릭 이벤트 설정
// 사용자가 검색 버튼(#search)을 클릭하면 이벤트가 발생합니다.
// 클릭 시, 책 제목을 가져와 검색을 수행합니다.
// 3️⃣ 입력한 책 제목 가져오기 및 전처리
// #bookName 입력란에서 사용자가 입력한 책 제목을 가져옵니다.
// trim() 함수를 사용하여 앞뒤 공백을 제거합니다.
// 4️⃣ 입력값 검사 (2글자 이상 입력 요구)
// 입력한 책 제목이 2글자 미만이면 경고 메시지를 띄우고 검색을 중단합니다.
// 최소한 2글자를 입력해야 검색을 진행할 수 있습니다.
// 5️⃣ 검색 키워드 생성
// 사용자가 입력한 책 제목에서 앞 두 글자를 추출하여 검색 키워드로 사용합니다.
// 이후 API 요청 시, 전체 제목으로 검색을 수행합니다.
// 6️⃣ 카카오 책 검색 API 요청
// $.ajax()를 사용하여 GET 요청을 보냅니다.
// 요청의 URL은 "https://dapi.kakao.com/v3/search/book?target=title" 입니다.
// data에 사용자가 입력한 제목을 query로 전달하여 검색을 수행합니다.
// headers에 API 키를 포함하여 인증을 진행합니다.
// 7️⃣ API 응답 처리 (성공 시)
// API에서 받은 msg.documents 배열을 확인하여 검색된 책 목록을 가져옵니다.
// 검색된 개수가 0개이면 "책을 찾을 수 없습니다." 라는 메시지를 표시합니다.
// 검색 결과가 있으면, 다음 기준으로 필터링을 수행합니다:
// 입력한 책 제목과 완전히 일치하는 책
// 입력한 앞 두 글자와 일치하는 책
// 8️⃣ 검색 결과 필터링 및 최소 5개 보장
// 필터링된 책 목록을 가져온 후, 최대 5개 이상 표시하도록 설정합니다.
// 검색된 개수가 5개 미만이면 있는 만큼만 출력합니다.
// slice()를 사용하여 최대 표시 개수를 조정합니다.
// 9️⃣ 검색 결과 HTML로 변환하여 화면에 출력
// 필터링된 책 정보를 HTML 코드로 변환하여 #result 영역에 표시합니다.
// 각 책은 다음 정보를 포함하여 화면에 출력됩니다:
// 책 제목
// 저자 정보
// 책 표지 이미지
// 가격
// 판매 상태(정상 판매, 품절 등)
// 🔟 API 요청 실패 시 오류 처리
// API 요청이 실패하면 console.error()를 통해 오류 내용을 출력합니다.
// 사용자에게 "API 요청 중 오류가 발생했습니다." 라는 경고창을 띄웁니다.



$(document).ready(function () {
    $("#search").click(function () {
        let bookTitle = $("#bookName").val().trim();

        // 입력한 책 제목의 앞 두 글자가 빈 문자열이 아니고, 길이가 2 이상이어야 검색
        if (bookTitle.length < 2) {
            alert("책 제목의 앞 두 글자를 입력하세요.");
            return;
        }

        let searchKeyword = bookTitle.substring(0, 2); // 입력한 앞 두 글자

        $.ajax({
            method: "GET",
            url: "https://dapi.kakao.com/v3/search/book?target=title",
            data: { query: bookTitle }, // 전체 제목으로 검색
            headers: { Authorization: "KakaoAK" } // 여기에 실제 API 키 입력
        })
        .done(function (msg) {
            let resultHTML = "";
            let totalResults = msg.documents.length; // 검색된 개수

            if (totalResults > 0) {
                // 첫 두 글자와 일치하는 책과 전체 제목 일치하는 책을 구분하여 필터링
                let filteredBooks = msg.documents.filter(book => {
                    // 제목이 전체 일치하거나, 첫 두 글자와 일치하는 경우
                    return book.title.substring(0, 2) === searchKeyword || book.title.includes(bookTitle);
                });

                // 🔹 최소 5개 보장 (검색된 개수가 5개 미만이면 있는 만큼만 출력)
                let maxResults = Math.min(Math.max(filteredBooks.length, 5), filteredBooks.length); 
                let booksToShow = filteredBooks.slice(0, maxResults);

                booksToShow.forEach(book => {
                    resultHTML += `
                        <div class="book-container">
                            <div class="book-title">📖 ${book.title}</div>
                            <div class="book-authors">✍ 저자: ${book.authors.join(", ") || "정보 없음"}</div>
                            <img class="book-image" src="${book.thumbnail}" alt="책 이미지"/>
                            <div class="book-price">💰 가격: ${book.price.toLocaleString()}원</div>
                            <div class="book-status">📌 상태: ${book.status || "정보 없음"}</div>
                        </div>
                        <hr>
                    `;
                });
            } else {
                resultHTML = `<strong>입력한 제목의 책을 찾을 수 없습니다.</strong>`;
            }

            $("#result").html(resultHTML);
        })
        .fail(function (err) {
            console.error("API 요청 실패: ", err);
            alert("API 요청 중 오류가 발생했습니다.");
        });
    });
});
