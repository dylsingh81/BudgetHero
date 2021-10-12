var cookieId = undefined;

async function handleNewConnection() {
  //Check if current ID cookie exists.
  let cookieExists = checkACookieExists("id");
  if (cookieExists) {
    //Get cookie ID from DB and store in variable
    cookieId = getCookieValue("id");
    cookieId = parseInt(cookieId);
    console.log("Loaded Cookie:", cookieId);
  } else {
    console.log("Here - send create cookie");
    //Get Next ID from server && Create Entry in DB on server
    var data = {first: "survey"};
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    response = await fetch("../createCookie", options);
    json = await response.json();

    cookieId = json.cookie_id;

    //Create Cookie using ID
    createCookie("id", cookieId);
    console.log("Cookie Created:", cookieId);
  }
}

handleNewConnection();

small = 50;

Survey.StylesManager.applyTheme("bootstrap");


var json = {
  title: "Please Fill out the Survey Below:",
  pages: [
    {
      title:
      " ![Chart](./images/chart.png =90%x90%)" +
      "\n\n\nThe chart represents the current US Budget. If you were to make up the budget for the federal government this year, what percentages would you allocate to each of the categories?", 

      questions: [
        {
          name: "Economic_assistance_to_needy_people_around_the_world",
          title: "Economic assistance to needy people around the world",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 1,
        },
        {
          name: "Economic_assistance_to_needy_people_in_the_US",
          title: "Economic assistance to needy people in the U.S.",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 10,
        },
        {
          name: "Anti_terrorism_defenses_in_the_US",
          title: "Anti-terrorism defenses in the U.S.",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,     
          defaultValue: 7,
   
        },
        {
          name: "Health_care",
          title: "Health care",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 14,
        },
        {
          name: "Rebuilding_highways_bridges_and_roads",
          title: "Rebuilding highways, bridges and roads",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 3,
        },
        {
          name: "Environmental_protection",
          title: "Environmental protection",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 1,
        },
        {
          name: "Medicare",
          title: "Medicare",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 15,
        },
        {
          name: "Education",
          title: "Education",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 5,
        },
        {
          name: "Government_assistance_for_the_unemployed",
          title: "Government assistance for the unemployed",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 9,
        },
        {
          name: "Scientific_research",
          title: "Scientific research",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 1,
        },
        {
          name: "Military_defense",
          title: "Military defense",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 8,
        },
        {
          name: "Social_Security",
          title: "Social Security",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,
          defaultValue: 22,
        },
        {
          name: "Veterans_benefits_and_services",
          title: "Veterans benefits and services",
          isRequired: true,
          type: "nouislider",
          rangeMin: 0,
          rangeMax: small ? small : 100,  
          defaultValue: 4,        
        },
      ],
    },
  ],
};

window.survey = new Survey.Model(json);
sent = false;
survey.onComplete.add(function (sender) {
  document.querySelector("#surveyResult").innerHTML =
    '<br><br><br><a class="btn btn-primary" href="../game/game.html" >Click Here to Go to the Game</a>';

  async function sendSurveyData(cookie_id, sender) {
    sendData = sender.data;
    var data = { cookie_id: cookieId, surveyData: sendData };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch("../surveyData", options);
  }
  if (!sent) {
    sendSurveyData(cookieId, sender);
    sent = true;
  }
});

let totalPercent = 0;
//Get sum of all default values
json.pages[0].questions.forEach((question) => {
  totalPercent += question.defaultValue;
});
document.getElementById("pec-span").innerHTML = totalPercent + "%";


const names = json.pages[0].questions.map((question) => question.title);
const titles = json.pages[0].questions.map((question) => question.name);
const values = json.pages[0].questions.map((question) => question.defaultValue);
const choices = document.getElementById("choice-list");
//Create list element for each name
names.forEach((name) => {
  title = titles[names.indexOf(name)];

  const li = document.createElement("li");
  li.innerHTML = name;
  li.id = title;
  li.style.fontSize = "0.75em";
  li.className = "list-group-item d-flex justify-content-between align-items-center"

  //Create span for list element
  const span = document.createElement("span");
  span.id = title + "-span";
  span.className = "badge bg-primary rounded-pill";
  span.style.fontSize = "1em";
  span.innerHTML = values[names.indexOf(name)] + "%";
  li.appendChild(span);

  choices.appendChild(li);
});

var prevElement = null;

//Dash of breakdown of spending
function updateDash(senderData,data) {
  key = data.name
  value = data.value

  const listElement = document.getElementById(key);
  listElement.className = "list-group-item d-flex justify-content-between align-items-center list-group-item-primary";
  if(prevElement != listElement && prevElement != null){
    prevElement.className = "list-group-item d-flex justify-content-between align-items-center";
  }
  prevElement = listElement;

  const span = document.getElementById(key + "-span");
  //Update span element
  span.innerHTML = value + "%";
  

  //Get total of all values
  let total = 0;
  for (let key2 in senderData) {
    total += senderData[key2];
  }
  if(total == 100){
    document.getElementById("tot-pec-span").style.color = "green";
    document.getElementById("pec-warning").innerHTML = "";
    //Get all questions from survey
    clearErrors();
  }
  else{
    document.getElementById("tot-pec-span").style.color = "red";
    document.getElementById("pec-warning").innerHTML = " - Need 100% To Complete";
  }
  document.getElementById("pec-span").innerHTML = total + "%";
}

function clearErrors() {
  if(!survey || !survey.currentPage) return;
  var questions = survey.currentPage.questions;
  //console.log(survey.currentPage)
  for(var i = 0; i < questions.length; i ++) {
    questions[i].clearErrors()
    //cssTitle: "sv-title sv-question__title sv-question__title--required sv-question__title--error"
  }
}


survey.onValueChanged.add(function (sender, options) {
  updateDash(sender.data, options);
});

//survey.showProgressBar = "bottom";

function surveyValidateQuestion(s, options) {
  //Get sum of s.data
  let total = 0;
  for (let key in s.data) {
    total += s.data[key];
  }
  if (total != 100) {
    options.error = "Please make sure you use 100% of the spending";
    return false;
  }
}

survey
    .onValidateQuestion
    .add(surveyValidateQuestion)


survey
    .onUpdateQuestionCssClasses
    .add(function (survey, options) {
        var classes = options.cssClasses
        //console.log(classes)
    });

function onAngularComponentInit() {
  Survey.SurveyNG.render("surveyElement", { model: survey });
}
var HelloApp = ng.core
  .Component({
    selector: "ng-app",
    template:
      '<div id="surveyContainer" class="survey-container contentcontainer codecontainer"><div id="surveyElement"></div></div> ',
  })
  .Class({
    constructor: function () {},
    ngOnInit: function () {
      onAngularComponentInit();
    },
  });
document.addEventListener("DOMContentLoaded", function () {
  ng.platformBrowserDynamic.bootstrap(HelloApp);
});


//Create showdown markdown converter
var converter = new showdown.Converter();
survey
    .onTextMarkdown
    .add(function (survey, options) {
        //convert the markdown text to html
        var str = converter.makeHtml(options.text);
        //remove root paragraphs <p></p>
        str = str.substring(3);
        str = str.substring(0, str.length - 4);
        //set html
        options.html = str;
    });