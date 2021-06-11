Survey.StylesManager.applyTheme("modern");

var json = {
  title:"Survey",
  pages: [
    {
      title: "If you were making up the budget for the federal government this year, would you increase spending, decrease spending, or keep spending the same for:", 
      questions: [
        {
          type: "radiogroup",
          name: "Health care",
          title: "Health care",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Anti-terrorism defenses in the U.S.",
          title: "Anti-terrorism defenses in the U.S.",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Veterans benefits and services",
          title: "Veterans benefits and services",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Social Security",
          title: "Social Security",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },

        {
          type: "radiogroup",
          name: "Rebuilding highways, bridges and roads",
          title: "Rebuilding highways, bridges and roads",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Economic assistance to needy people in the U.S.",
          title: "Economic assistance to needy people in the U.S.",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Scientific research",
          title: "Scientific research",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Military defense",
          title: "Military defense",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Government assistance for the unemployed ",
          title: "Government assistance for the unemployed ",
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
          name: "Environmental protection",
          title: "Environmental protection",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Economic assistance to needy people around the world",
          title: "Economic assistance to needy people around the world",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
        {
          type: "radiogroup",
          name: "Education",
          title: "Educationy",
          isRequired: true,
          choices: ["Increase", "Decrease", "Remain The Same"],
        },
      ],
    },
  ],
};

window.survey = new Survey.Model(json);

survey.onComplete.add(function (sender) {
  document.querySelector("#surveyResult").textContent =
    "Result JSON:\n" + JSON.stringify(sender.data, null, 3);
});

survey.showProgressBar = "bottom";

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
y;
