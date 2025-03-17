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
