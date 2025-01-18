document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const userNameInput = document.getElementById('username');
    const statsCotiner = document.querySelector('.stats-container');
    const easyProgresscircle = document.querySelector('.easy-progress');
    const mediumProgresscircle = document.querySelector('.mid-progress');
    const hardProgresscircle = document.querySelector('.Hard-progress');
    const easyLevel = document.getElementById('easy-level');
    const mediumLevel = document.getElementById('mid-level');
    const hardLevel = document.getElementById('Hard-level');
    const cardStatusContainer = document.querySelector('.stats-card');

    // return true or false
    function ValidateUserName(username) {
        if (username.trim() === '') {
            alert('username can not be empty');
            return false;
        }
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
        const isMatched = nameRegex.test(username);
        if (!isMatched) {
            alert('invalid usename');
        }
        return isMatched;

    }


    async function fetchUserData(username) {
        try {
            searchButton.textContent = 'searching...';
            searchButton.disabled = true;

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const url = 'https://leetcode.com/graphql';
            const header = new Headers();
            header.append('Content-Type', 'application/json');

            const graphql = JSON.stringify({
                query: `
                    query userSessionProgress($username: String!) {
                        allQuestionsCount {
                            difficulty
                            count
                        }
                        matchedUser(username: $username) {
                            submitStats {
                                acSubmissionNum {
                                    difficulty
                                    count
                                    submissions
                                }
                                totalSubmissionNum {
                                    difficulty
                                    count
                                    submissions
                                }
                            }
                        }
                    }
                `,
                variables: {
                    username: username
                }
            });

            const requestOptions = {
                method: "POST",
                headers: header,
                body: graphql,
                redirect: "follow"
            };

            const res = await fetch(proxy + url, requestOptions);
            if (!res.ok) {
                throw new Error('Unable to fetch the user details');
            }
            const parsedData = await res.json();
            displayUserData(parsedData);
        } catch (e) {
            console.log(e);
            statsCotiner.innerHTML = '<p>No data found</p>';
        } finally {
            searchButton.textContent = 'search';
            searchButton.disabled = false;
        }
    }


    function updateProgress(solved, total, lavel, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        lavel.textContent = `${solved}/${total}`;

    }


    function displayUserData(parsedData) {
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;


        const solvedTotalQuest = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyQuest = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumlQuest = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardQuest = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedEasyQuest, totalEasyQues, easyLevel, easyProgresscircle);
        updateProgress(solvedMediumlQuest, totalMediumQues, mediumLevel, mediumProgresscircle);
        updateProgress(solvedHardQuest, totalHardQues, hardLevel, hardProgresscircle);



        const cardsData=[
            {
                lavel:'Overall Submission', value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions
            },
            {
                lavel:'Overall Easy Submission', value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions
            },
            {
                lavel:'Overall Medium Submission', value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions
            },
            {
                lavel:'Overall Hard Submission', value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions
            }
        ];

        cardStatusContainer.innerHTML=cardsData.map((cardsData)=>{
            return `<div class='card'>
            <h3>${cardsData.lavel}</h3>
            <p>${cardsData.value}<p>
            </div>`
        }).join('');




    }


    searchButton.addEventListener('click', function () {
        const username = userNameInput.value;
        console.log('user name is: ', username);
        if (ValidateUserName(username)) {
            fetchUserData(username);
        }
    })

});