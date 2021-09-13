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

Survey.StylesManager.applyTheme("modern");

var json = {
  title: "Please Fill out the Survey Below:",
  pages: [
    {
      title:
      " ![Chart](./images/chart.png =100%x100%)" +
      "\n\nUsing the information above, if you were making up the budget for the federal government this year, would you increase spending, decrease spending, or keep spending the same for:",

      questions: [
        {
          type: "radiogroup",
          name: "Health_care",
          title: "Health care",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Anti_terrorism_defenses_in_the_US",
          title: "Anti-terrorism defenses in the U.S.",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Veterans_benefits_and_services",
          title: "Veterans benefits and services",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Social_Security",
          title: "Social Security",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },

        {
          type: "radiogroup",
          name: "Rebuilding_highways_bridges_and_roads",
          title: "Rebuilding highways, bridges and roads",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Economic_assistance_to_needy_people_in_the_US",
          title: "Economic assistance to needy people in the U.S.",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Scientific_research",
          title: "Scientific research",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Military_defense",
          title: "Military defense",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Government_assistance_for_the_unemployed",
          title: "Government assistance for the unemployed",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Medicare",
          title: "Medicare",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Environmental_protection",
          title: "Environmental protection",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Economic_assistance_to_needy_people_around_the_world",
          title: "Economic assistance to needy people around the world",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Education",
          title: "Education",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
      ],
    },
  ],
};

window.survey = new Survey.Model(json);
sent = false;
survey.onComplete.add(function (sender) {
  document.querySelector("#surveyResult").innerHTML =
    '<a class="btn btn-primary" href="../game/game.html" >Click Here to Go to the Game</a>';

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

//Dash of breakdown of spending
function updateDash() {
  let inc = document.querySelectorAll('.list-group-item-success').length
  let dec = document.querySelectorAll('.list-group-item-danger').length
  let same = document.querySelectorAll('.list-group-item-secondary').length

  document.getElementById("rts-span").innerHTML = same
  document.getElementById("inc-span").innerHTML = inc
  document.getElementById("dec-span").innerHTML = dec

}

survey.onValueChanged.add(function (sender, options) {
  var ul = document.getElementById("choice-list");
  classToSwitch = ""
  switch(options.value) {
    case "Increase":
      classToSwitch = "list-group-item list-group-item-success"
      break;
    case "Decrease":
      classToSwitch = "list-group-item list-group-item-danger"
      break;  
    case "Remain The Same":
      classToSwitch = "list-group-item list-group-item-secondary"
      break;
  }


  const listItems = ul.getElementsByTagName("li");
  for (let i = 0; i <= listItems.length - 1; i++) {
    if (listItems[i].id == options.name) {
      //edit option
      listItems[i].className = classToSwitch
      updateDash()
      return;
    }
  }
  //Create new option
  var li = document.createElement("li");
  li.id = options.name;
  li.className = classToSwitch
  li.style.fontSize = "12px";
  li.appendChild(
    document.createTextNode(
      options.name.replace(/_/g, " ")
    )
  );
  ul.appendChild(li);
  updateDash()
  return;

  //chosen.push(options.name)
});

//survey.showProgressBar = "bottom";

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