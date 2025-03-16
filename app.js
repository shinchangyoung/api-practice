$(document).ready(function () {
    // 페이지가 로드되면 실행되는 코드
    
    $("#search").click(function () {
        // 검색 버튼 클릭 시 실행되는 코드

        // 입력된 책 제목을 가져오고 앞뒤 공백을 제거
        let bookTitle = $("#bookName").val().trim();

        // 책 제목이 비어 있으면 경고 메시지를 표시하고 함수 종료
        if (bookTitle === "") {
            alert("책 제목을 입력하세요.");
            return;
        }

        // Kakao API로 책 검색 요청
        $.ajax({
            method: "GET",  // HTTP 요청 방식 (GET)
            url: "https://dapi.kakao.com/v3/search/book?target=title",  // Kakao 책 검색 API 엔드포인트
            data: { query: bookTitle },  // 'query' 파라미터로 입력한 책 제목 전달
            headers: { Authorization: "KakaoAK" }  // API 인증을 위한 헤더 (KakaoAK 뒤에 실제 API 키를 입력해야 함)
        })
        .done(function (msg) {
            // API 요청이 성공했을 때 실행되는 코드

            // 검색 결과가 있을 경우
            if (msg.documents.length > 0) {
                // 첫 번째 검색 결과 가져오기
                let firstBook = msg.documents[0];

                // 첫 번째 책 제목을 <strong> 태그로 강조하여 출력
                $("p").html("<strong>" + firstBook.title + "</strong><br>");
                
                // 첫 번째 책의 썸네일 이미지를 추가
                $("p").append("<img src='" + firstBook.thumbnail + "' alt='책 이미지'/>");
            } else {
                // 검색 결과가 없을 경우
                $("p").html("<strong>검색 결과가 없습니다.</strong>");
            }
        })
        .fail(function (err) {
            // API 요청이 실패했을 때 실행되는 코드

            // 콘솔에 오류 정보 출력
            console.error("API 요청 실패: ", err);
            
            // 사용자에게 알림 메시지 표시
            alert("API 요청 중 오류가 발생했습니다.");
        });
    });
});
