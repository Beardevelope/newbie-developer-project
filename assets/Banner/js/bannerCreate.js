async function saveBanner() {
    const title = document.getElementById('title').value;
    const image = document.getElementById('image').files[0];

    // 토큰 가져오기 >> 구글 로그인 토큰 정보 확인 후 결정.
    const accessToken = "토큰";
    // const accessToken = localStorage.getItem('accessToken');

    // 필수값 설정
    if (!title || !image) {
        alert('제목과 이미지는 필수 입력 항목입니다.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', image);

    try {
        const response = await fetch('http://localhost:3000/banner/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
            mode: 'cors',
        })


        if (response.ok) {
            alert('배너가 생성되었습니다.');
            window.location.href = '../html/bannerList.html';
        } else {
            alert('배너 생성에 실패했습니다. 관리자에 문의하세요.');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

// 목록으로 이동
function goToList() {
    document.location.href = '../html/bannerList.html'
}