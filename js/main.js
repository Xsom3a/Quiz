//======== Start My App
(function() {

    //========== All Required Elments .
    const [instructions, quiz, selectBox, questionsCount, questionParent, message, button, bottomBar, bulletsParent, countDown] = [document.querySelector('.instructions'), document.querySelector('.quiz-app'), document.querySelector('select'), document.querySelector('.questions-count span'), document.querySelector('.question'), document.querySelector('.message'), document.querySelector('button'), document.querySelector('.bottom-bar'), document.querySelector('.bullets'), document.querySelector('.count')];

    //========== Main Vars .	  
    let decreNum = 0,
        score = 0,
        questionNumber, correctAnswer, totalTime, interv, time = totalTime;

    //============= Fetch Data From Json File .
    async function fetchdata() {
        await fetch('js/data.json').then(result => result.json())
            .then(result => {

                // All Category Keys & Length From Json Data File
                let categoryKeys = Object.keys(result[+false].category);
                let keysLength = categoryKeys.length;

                // Get First Category & His Questions Count Length .
                let firstCategory = Object.keys(result[+false].category)[+false];
                let firstQLength = Object.keys(Object.entries(result[+false].category)[+false][+true]).length;

                // Last Category
                let lastCategory = Object.keys(result[+false].category)[categoryKeys.length - +true];

                // Get All Object Inside Every Category .
                let data = Object.entries(result[+false].category);

                // Get Questions Count Number To Every Category.
                let everyCategoryQ = Object.keys(data).length;

                //======= Run The Top Bar Function
                topBar(category, firstCategory, categoryKeys, result, data, firstQLength);

                //======= Run Show Question And Answers Function 
                finlize(result, categoryKeys, data, firstCategory, time);
            });
    };

    //========= Hidden Instructions If User In The Same Sesstion .
    if (sessionStorage.getItem('state') !== null) {
        instructions.remove();
    };

    //========= Window On Load POP_UP .
    window.onload = () => {
        instructions.style.cssText = `display: flex;`;
        instructions.querySelector('a').onclick = (e) => {
            e.preventDefault();
            instructions.remove();
            sessionStorage.state = 'hidden';
        };
        fetchdata();
    };

    //================== Function Set The Category Select Box & Questions Count.
    function topBar(category, firstCategory, categoryKeys, result, data, firstQLength) {

        // Set The Defalut Question Count From First Category
        questionsCount.innerHTML = firstQLength;

        // Add Category Danymic To Select Box
        categoryKeys.forEach((key, index) => {

            // Create Select Options .
            let opt = document.createElement('option');

            //=== Set Option content & Value
            opt.textContent = key;
            opt.value = key;

            //====== Append Options To Main Select Box.
            selectBox.appendChild(opt);

            //====== Set & Change Category From Select Box
            selectBox.onchange = (e) => {

                // Loop On All Options 
                Array.from(selectBox.querySelectorAll('option')).forEach((e, oIndex) => {

                    // Get All Object Inside Every Category .
                    data[oIndex][+true];

                    // Get Questions Count Number To Every Category.
                    let everyCategoryQ = Object.keys(data[oIndex][+true]).length;

                    // When User Select Option From all Options.
                    if (e.selected) {
                        // Change First Category To selected Category .
                        firstCategory = e.textContent;

                        // Empty Question & Bullets Container .
                        questionParent.innerHTML = '';
                        bulletsParent.innerHTML = '';

                        // Reset Number Count
                        decreNum = 0;
                        score = 0;

                        // Stop InterVal
                        clearInterval(interv);

                        // Reset Time Depend On Total Time
                        time = totalTime;

                        // Show Button & Bullets
                        hidding('1', 'unset');

                        // Run Show Function
                        finlize(result, categoryKeys, data, firstCategory, time);

                        // Set Questions Count To Every Category On Top Bar.
                        if (e.textContent === categoryKeys[oIndex]) {
                            questionsCount.innerHTML = everyCategoryQ;
                        };
                    };
                });
            };
        });
    };

    //================= Function Show The Question & All Answers .
    function finlize(result, categoryKeys, data, firstCat, allTime) {

        //=========== All Required Data From Json File .
        const everyCategoryallData = result[+false].category[firstCat];
        const everyCategoryallDataK = Object.keys(everyCategoryallData);
        const everyCategoryallDataKL = everyCategoryallDataK.length;
        const everyCategoryallDataV = Object.values(everyCategoryallData);

        //========== Set Number Of Question On Every Category . 	
        questionNumber = everyCategoryallDataKL;

        //======== Every Question Have [30] Second .
        allTime = 50 * everyCategoryallDataKL;

        //========== Main Button Function On Click .
        button.onclick = (e) => {
            //======== Get All Input Radio
            let allRadio = document.querySelectorAll('.question ul li input');
            let allLabel = document.querySelectorAll('.question ul li label');
            //======= Show Error Message 
            message.style.visibility = 'visible';
            //======== Loop On All Input Radio
            allRadio.forEach((e, index) => {
                if (e.checked) {
                    //====== The Selected Answer .
                    let selectedAnswer = allLabel[index].textContent;
                    //====== Increase Score Every Select Correct Answer .
                    if (correctAnswer === selectedAnswer) {
                        score++;
                    }
                    //===== Increase Number . 
                    ++decreNum;
                    //====== Hide Error Message 
                    message.style.visibility = 'hidden';
                };
            });
            //========= Empty Question Container .
            questionParent.innerHTML = '';
            //========= Check If Number Equal Every Category Keys Numbers .
            if (decreNum === everyCategoryallDataK.length) {
                //====== Hide Message
                message.style.visibility = 'hidden';
                //====== Reset Decrement Num To zero .
                decreNum = 0;
                //===== Stop InterVal
                clearInterval(interv);
                //===== Hide Button Function
                hidding('0', 'none');
                //======= Run Qusetions Result Message .
                resultMsg();
            } else { //======= Show The Data
                //======= Empty Bullets Container .
                bulletsParent.innerHTML = '';
                //====== Run Show Data Function 
                showData(decreNum);
            };
        };

        //========== Function Handel Questions & Answers .
        function showData(decreNum) {
            //==== Get All Keys & Values From Every Category .
            let answers = everyCategoryallDataV[decreNum].answers;
            let answersArr = Object.values(answers);
            let lastAnswer = answersArr[answersArr.length - 1];
            //==== Create [Ul, Qhead]
            let linksParent = document.createElement('ul');
            let heading = document.createElement('h3');
            //==== Create Bullets [Ul] Container
            let bulletsContainer = document.createElement('ul');
            //==== Every Question Head Content
            let Qhead = everyCategoryallDataV[decreNum].question;
            //==== Set Correct Answers Content
            correctAnswer = answers.correct_answer;
            //==== Append Bullets [Ul] Container To Bullets Parent .
            bulletsParent.appendChild(bulletsContainer);
            //==== Prepend Head To Conatiner
            questionParent.prepend(heading);
            //==== Append Form To Questions Parent .
            questionParent.appendChild(linksParent)
                //==== Set Quetsion Head Content
            heading.textContent = Qhead;
            //===== Generate Random Order Number 
            let randOrder = Math.ceil(Math.random() * answersArr.length);
            //======= Loop On All answers & Show It .
            for (let i = 0; i < answersArr.length; i++) {
                //===== Create List Items & Check Box					
                let listItems = document.createElement('li');
                let label = document.createElement('label');
                let radio = document.createElement('input');
                //==== ListItems Attribue
                listItems.setAttribute('for', `answer_${i + 1}`);
                //==== Set Label Attribue
                label.setAttribute('for', `answer_${i + 1}`);
                label.setAttribute('title', `Select`);
                //==== Set Attribute Type
                radio.setAttribute('type', 'radio');
                radio.setAttribute('title', 'Select');
                radio.setAttribute('name', 'answers');
                radio.setAttribute('id', `answer_${i + 1}`);
                //==== Append ListItems Content To Labels
                label.prepend(answersArr[i]);
                //==== Append Radio & Label To List Items
                listItems.prepend(radio);
                listItems.appendChild(label);
                //==== Append ListItems To Parent
                linksParent.appendChild(listItems);
                //==== Change Last Item Order Random
                if (listItems.textContent === lastAnswer) {
                    listItems.style.cssText = `order: ${randOrder}`;
                };
            };

            //=========== Add Selected Class To Selected Answer.
            Array.from(questionParent.querySelectorAll('ul li')).forEach((e) => {
                e.onclick = () => {
                    // console.log(e)
                    questionParent.querySelectorAll('ul li').forEach(e => {
                        e.classList.remove('selected');
                    });
                    //===== Add Selected Class 
                    e.classList.add('selected');
                    //====== Hide Error Message 
                    message.style.visibility = 'hidden';
                };
            });

            //======== Loop On All Category Key & Create Bullets List  Item.
            for (let i = 0; i < everyCategoryallDataK.length; i++) {
                // Create Bullets Item .
                let bullets = document.createElement('li');
                // Set Bullets Item Content .
                bullets.innerHTML = i + 1;
                // Append Bullets To Bullets container.
                bulletsContainer.appendChild(bullets);
            };
            //======= Add Active Class To Bullets On Every Click
            let activeBtn = bulletsParent.querySelectorAll('ul li')[decreNum];
            activeBtn.classList.add('active');
        };
        //========== Run Function Handel Questions & Answers . 
        showData(decreNum);

        //======== Function Handel Count Down Time .
        (function countDownFunc() {
            //============ Set Minutes & Seconds And Append To Bottom Bar;
            function setTiming() {
                //==== Minutes & Seconds .
                let minutes = Math.floor(allTime / 60);
                let seconds = allTime % 60;
                //======= Add [0] Before Minutes & Seconds .
                if (minutes < 10) {
                    countDown.innerHTML = (`0${minutes}:${seconds}`);
                    if (seconds < 10) countDown.innerHTML = (`0${minutes}:0${seconds}`)
                } else countDown.innerHTML = (`${minutes}:${seconds}`)
            };
            //======== Run Set Cont Down Time Function .
            setTiming();

            //======= Decrement Time Every [1] Second .
            interv = setInterval(() => {
                //==== Run Set Cont Down Time Function .
                setTiming();
                //==== Decrement [1] From Total Time Every [1] Second .
                allTime -= 1;
                //==== Stop The Decrement Interval When Total Time Finish .
                if (allTime < 0) {
                    //=== Stop The Interval .
                    clearInterval(interv);
                    //==== Empty Question Container .
                    questionParent.innerHTML = '';
                    //==== Hide Message
                    message.style.visibility = 'hidden';
                    //=== Run Finish Function .
                    hidding('0', 'none');
                    //=== Run Result Message On Time Finish .
                    resultMsg(allTime);
                };
            }, 1000);
        }());
    };

    //================ Function Hide Button & Bullets If The Questions End .
    function hidding(opacity, pointer) {
        // Hidden Button & Bottom Bar
        button.style.cssText = `opacity: ${opacity}; pointer-events: ${pointer};`;
        bottomBar.style.opacity = opacity;
    };

    //================ Questions Result Function . 
    function resultMsg(timing) {
        //========== Create Result Box
        let resultBox = document.createElement('div');
        //======== Set Class Name
        resultBox.className = 'result-box';
        //========= If User Failed On Quiz
        if (score < questionNumber / 2) {
            resultBox.innerHTML = `<div><span class='fail'>OOPS</span>, you answer <span class='fail'> ${score} </span> question from all this category questions</div>`;
            // Run Create Progress Function
            progress(questionNumber, score);
        } else { //======= If User Succsess On Quiz
            resultBox.innerHTML = `<div><span class='succses'>congrats</span>, you answer <span class='succses'> ${score} </span> questions from all this category questions</div>`;
            // Run Create Progress Function
            progress(questionNumber, score);
        };
        //======== Function Create Score Status Progress
        function progress(totalQuestions, score) {
            // Create Progress
            let div = document.createElement('div');
            let p = document.createElement('p');
            let progress = document.createElement('progress');
            let span = document.createElement('span');
            let percentge = `${Math.ceil(score*100/totalQuestions)}`;
            // Div ClassName
            div.className = 'progress-status';
            // Pargraph Content
            p.textContent = 'Your Progress ::';
            // Set Progress Attribute
            progress.setAttribute('min', 0);
            progress.setAttribute('max', totalQuestions);
            progress.setAttribute('value', score);
            // Sapn Content
            span.innerHTML = `${percentge}%`;
            // Span Style
            span.style.cssText = `left: ${percentge - 2}%`;
            //===== Check The Score Status 
            if (score >= totalQuestions / 2) { // Succses
                progress.className = 'succses-state';
                span.className = 'succses-state';
            } else { // Fail
                progress.className = 'fail-state';
                span.className = 'fail-state';
            };
            // Append My Elements
            div.prepend(p)
            div.appendChild(progress);
            div.appendChild(span);
            resultBox.appendChild(div);
        };
        //========= If Time Is End
        if (timing < 0) {
            resultBox.innerHTML = `OOPS, time is over`;
            resultBox.classList.add('time-over')
        };
        //========== Append Elements
        questionParent.appendChild(resultBox);
    };
}());
//========== End My App
