
(function() {
    "use strict";

    const NUM_OF_QUESTIONS = 2;
    const BASE_URL = "api/";

    let curr = 0;
    let responses = [];

    window.addEventListener("load", function() {
        $("start").disabled = false;
        $("start").addEventListener("click", startGame);
    });

    function startGame() {
        $("intro").classList.add("hidden");
        $("questions").classList.remove("hidden");
        initOptions();
        initBtn();

        let options = qsa(".option");
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener("click", selection);
        }

        $("submit").addEventListener("click", submit);
    }

    function initOptions() {
        curr++;
        $("option1").src = "img/q" + curr + "-option1.png";
        $("option2").src = "img/q" + curr + "-option2.png";
        $("option1").classList.remove("selected");
        $("option2").classList.remove("selected");
    }

    function initBtn() {
        $("submit").classList.add("hidden");
        if (curr == NUM_OF_QUESTIONS) {
            $("submit").innerText = "Finish";
        }
    }

    function selection() {
        $("submit").classList.remove("hidden");
        this.classList.add("selected");

        let options = qsa(".option");
        for (let i = 0; i < options.length; i++) {
            if (options[i].id !== this.id) {
                options[i].classList.remove("selected");
            }
        }
    }

    function submit() {
        // record response for the question
        let options = qsa(".option");
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains("selected")) {
                responses.push(i + 1);
            }
        }

        if (curr == NUM_OF_QUESTIONS) {
            // TODO: send the reponses to server
            let params = new FormData();
            for (let i = 0; i < responses.length; i++) {
                params.append("responses[]", responses[i]);
            }

            fetch(BASE_URL + "record_response.php", {method: "POST", body: params})
                .then(checkStatus)
                .then(resp => resp.text())
                .then(resp => {
                    let message = "";
                    if (resp == "success") {
                        message = "your responses have been recorded!";
                    } else {
                        message = "looks like something went wrong :(";
                    }

                    let p = document.createElement("p");
                    p.innerText = message;
                    $("end-game-menu").insertBefore(p, $("end-game-menu").children[1]);
                })
                .catch(handleError);

            $("questions").classList.add("hidden");
            $("end-game-menu").classList.remove("hidden");
            $("show-stats").addEventListener("click", showStats);

            // // this is only temporary
            // let message = "Your responses are:";
            // for (let i = 0; i < responses.length; i++) {
            //     message += (" " + responses[i]);
            // }

            // let p = document.createElement("p");
            // p.innerText = message;
            // $("end-game-menu").appendChild(p);
        } else {
            initOptions();
            initBtn();
        }
    }

    // TODO: obtain stats from server
    function showStats() {
        $("stats").classList.remove("hidden");
        $("stats").classList.add("stats-container");
        $("end-game-menu").classList.add("hidden");

        fetch(BASE_URL + "get_stats.php")
            .then(checkStatus)
            .then(resp => resp.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    let div = document.createElement("div");
                    let heading = document.createElement("h3");
                    heading.innerText = "Results for Q" + data[i].qid;
                    let chart = generateChart(data[i].option1, data[i].option2);
                    let p = document.createElement("p");
                    p.innerText = "the answer is: " + data[i].answer;

                    div.appendChild(heading);
                    div.appendChild(chart);
                    div.appendChild(p);
                    $("stats").appendChild(div);
                }
            })
            .catch(handleError);
    }

    // y1 - number of counts on option 1
    // y2 - number of counts on option 2
    // return - div with plotted chart
    function generateChart(y1, y2) {
        let chart = document.createElement("div");
        chart.classList.add("chart-container");

        let data = [
            {
              x: ['option1', 'option2'],
              y: [y1, y2],
              width: [0.2, 0.2],
              type: 'bar'
            }
          ];
          
        let config = {responsive: true};
          
        Plotly.newPlot(chart, data, config);

        return chart;
    }

    // check whether the response from a fetch request is valid
    // return - boolean
    function checkStatus(response) {
        if (!response.ok) {
            throw Error("Error in request: " + response.statusText);
        }
        return response;
    }

    function handleError(error) {
        // console.log(error);
        console.log(error);
    }

    function qs(query) {
        return document.querySelector(query);
    }
    
    function $(id) {
        return document.getElementById(id);
    }

    // query - string
    // return - an array of node objects
    function qsa(query) {
        return document.querySelectorAll(query);
    }
  })();