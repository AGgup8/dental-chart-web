function Chart() {
  const defaultChart = {
    18: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    17: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    16: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    15: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    14: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    13: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    12: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    11: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    21: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    22: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    23: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    24: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    25: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    26: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    27: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    28: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    38: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    37: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    36: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    35: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    34: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    33: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    32: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    31: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    41: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    42: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    43: { whole: 1, top: 0, bottom: 0, right: 0, extra: "" },
    44: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    45: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    46: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    47: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
    48: { whole: 1, occlusal: 0, top: 0, bottom: 0, right: 0, extra: "" },
  };

  let chart = defaultChart;

  function updateData(tooth, code, newData) {
    return new Promise(function (resolve, reject) {
      // PARAMETERS
      // tooth - number - the string used to find the tooth to update
      // code - string - the string used to find the surface to update
      // newData - string - new data to add to the node

      const toothData = chart[tooth.toString()];

      // create updated specific tooth data e.g. {whole, occlusal, top, bottom, left, right}
      const newToothData = { ...toothData, [code]: newData };

      // create updated specific tooth object e.g. { 18: {whole, occlusal, top, bottom, left, right} }}
      const newTooth = { [tooth]: newToothData };

      // add new tooth object to chart object
      chart = { ...chart, ...newTooth };

      resolve();
    });
  }

  function setChart(data) {
    // PARAMETERS
    // data - object - chart object

    return new Promise(function (resolve, reject) {
      chart = data;
      resolve();
    });
  }

  function resetChart() {
    return new Promise(function (resolve, reject) {
      chart = defaultChart;
      resolve();
    });
  }

  function getChart() {
    return chart;
  }

  return {
    getChart,

    setChart,

    resetChart,

    updateData,
  };
}

function ChartModel(dataStructure) {
  const chartModel = dataStructure;

  function saveChart() {
    localStorage.setItem("chart", JSON.stringify(chartModel.getChart()));
  }

  function loadChart() {
    if (localStorage.chart !== null) {
      chartModel.setChart(JSON.parse(localStorage.chart)).then((result) => {
        $.publish("updated");
      });
    }
  }

  function clearChart() {
    chartModel.resetChart().then((result) => {
      localStorage.setItem("chart", JSON.stringify(chartModel.getChart()));
      $.publish("updated");
    });
  }

  function getModel() {
    return chartModel.getChart();
  }

  function updateChart(tooth, surface, data) {
    chartModel.updateData(tooth, surface, data).then((result) => {
      $.publish("updated");
      saveChart();
    });
  }

  return {
    getModel,

    updateChart,

    loadChart,

    clearChart,
  };
}

function ChartController(model) {
  $.subscribe("update", function (e, data) {
    model.updateChart(data["tooth"], data["surface"], data["newData"]);
  });

  $.subscribe("clear", function (e) {
    model.clearChart();
  });
}

function ChartView(model) {
  let selectedSurface = "";
  let selectedTooth = "";

  // visual functions

  function hideAllCavityDropdowns() {
    $(".cavity-dropdown-list").hide();
  }

  function hideAllToothDropdowns() {
    $(".main-dropdown-list").hide();
  }

  function addHighlight(element) {
    $(element).addClass("highlight");
  }

  function removeAllSurfaceHighlights() {
    $(".highlight").removeClass("highlight");
  }

  function setUpMainDropdowns() {
    var dropDownList = $("<div/>").addClass("main-dropdown-list");

    dropDownList.append(
      createListItem("None", 1),
      createListItem("Missing", "M"),
      createListItem("Artifical Tooth", "A"),
      createListItem("Bridge Abutment", "BA"),
      createListItem("Bridge Pontic", "BP"),
      createListItem("Crown", "CR"),
      createListItem("Fissure Sealant", "FS"),
      createListItem("Fractured", "F"),
      createListItem("Full Gold Crown", "FGC"),
      createListItem("Full Metal Crown", "FMC"),
      createListItem("Implant", "IMP"),
      createListItem("Instanding", "IN"),
      createListItem("Outstanding", "OUT"),
      createListItem("Partially Erupted", "PE"),
      createListItem("Porcelain Bonded Crown", "PBC"),
      createListItem("Porcelain Jacket Crown", "PJC"),
      createListItem("PRR", "PRR"),
      createListItem("Porcelain Veneer", "PV"),
      createListItem("Recently Extracted", "RE"),
      createListItem("Retained C", "RC"),
      createListItem("Rotated Mesially", "RM"),
      createListItem("Rotated Distally", "RD"),
      createListItem("Space Closed", "SC")
    );
    $(".dropdown").append(dropDownList);
  }

  function createImage(src, classText, alt) {
    return $("<img />", { src, alt, class: classText });
  }

  function createListItem(text, code) {
    return $("<p/>").text(text).data("code", code);
  }

  function setUpModal() {
    // Get the modal
    var modal = document.getElementById("clear-modal");

    // Get the button that opens the modal
    var btn = document.getElementById("clear-btn");
    var yesBtn = document.getElementById("yes-btn");
    var noBtn = document.getElementById("no-btn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
      modal.style.display = "flex";
    };

    // When the user clicks on <span> (x) or no-btn, close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };
    noBtn.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    // When the user clicks yes-btn, publish clear event
    yesBtn.onclick = function () {
      modal.style.display = "none";
      $.publish("clear");

      $("#notification").show();
      $("#notification").text("Chart cleared");
      $("#notification").fadeOut(10000);
    };
  }

  // end visual functions

  // logic functions

  function cavityTypeToNumber(element) {
    return $(element).data("cavity-type");
  }

  function toggleSurface(surface) {
    // deselect surface if surface is already selected
    if (compareToActiveSurface(surface)) {
      selectedTooth = "";
      selectedSurface = "";
      removeAllSurfaceHighlights();
      hideAllCavityDropdowns();
      $(".bring-to-front").removeClass("bring-to-front");
    } else {
      // select surface and tooth
      selectedTooth = $(surface).data("tooth");
      selectedSurface = $(surface).data("surface");

      removeAllSurfaceHighlights();
      hideAllCavityDropdowns();
      $(".bring-to-front").removeClass("bring-to-front");
      addHighlight(surface);
      $(surface).parents(".tooth").addClass("bring-to-front");
      $(surface).parents(".tooth").find(".cavity-dropdown-list").show();
    }
  }

  function compareToActiveSurface(surface) {
    if (
      selectedSurface == $(surface).data("surface") &&
      selectedTooth == $(surface).data("tooth")
    ) {
      return true;
    } else {
      return false;
    }
  }

  function resetSelectedTooth() {
    selectedTooth = "";
    selectedSurface = "";
    $(".bring-to-front").removeClass("bring-to-front");
  }

  function setUpClickListeners() {
    $(".occlusal").click(function () {
      toggleSurface(this);
    });

    $(".top").click(function () {
      toggleSurface(this);
    });

    $(".bottom").click(function () {
      toggleSurface(this);
    });

    $(".left").click(function () {
      toggleSurface(this);
    });

    $(".right").click(function () {
      toggleSurface(this);
    });

    $(".dropdown").on("click", ".dropdown-arrow", function () {
      removeAllSurfaceHighlights();
      hideAllCavityDropdowns();
      hideAllToothDropdowns();

      // hide dropdown if dropdown already shown
      if (
        selectedTooth == $(this).parent().data("tooth") &&
        selectedSurface == "whole"
      ) {
        resetSelectedTooth();
      } else {
        selectedTooth = $(this).parent().data("tooth");
        selectedSurface = $(this).parent().data("surface");
        $(this).parents(".tooth").addClass("bring-to-front");
        $(this).siblings(".main-dropdown-list").show();
      }
    });

    $(".dropdown").on("click", "p", function () {
      $(this).parent().hide();

      // publish event with the new data
      $.publish("update", {
        tooth: selectedTooth,
        surface: selectedSurface,
        newData: $(this).data("code"),
      });

      resetSelectedTooth();
    });

    $("body").on("mouseleave", ".tooth", function (e) {
      if ($(".main-dropdown-list").is(":visible")) {
        $(".main-dropdown-list").hide();
        resetSelectedTooth();
      }

      // make sure the tooth images are being shown on the top layer
      $("img.tooth-center").removeClass("send-to-back");
    });

    $(".cavity-dropdown-list p").click(function () {
      removeAllSurfaceHighlights();
      $(this).parent().hide();

      const newData = cavityTypeToNumber($(this));

      // publish event with surface data and the new data
      $.publish("update", {
        tooth: selectedTooth,
        surface: selectedSurface,
        newData: newData,
      });

      resetSelectedTooth();
    });

    $(".extra")
      .each(function () {
        this.setAttribute(
          "style",
          "height:" + this.scrollHeight + "px;overflow-y:hidden;"
        );
      })
      .on("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";

        // publish event with surface data and the new data
        const newData = $(this).val();
        const tooth = $(this).parent().data("tooth");
        const surface = "extra";
        $.publish("update", {
          tooth: `${tooth}`,
          surface: surface,
          newData: newData,
        });
      })
      .on("focus", function () {
        // deselect other elements
        removeAllSurfaceHighlights();
        hideAllToothDropdowns();
        hideAllCavityDropdowns();
      });

    $(".extra-bottom")
      .each(function () {
        this.setAttribute(
          "style",
          "height:" + this.scrollHeight + "px;overflow-y:hidden;"
        );
      })
      .on("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";

        // publish event with surface data and the new data
        const newData = $(this).val();
        const tooth = $(this).parent().data("tooth");
        const surface = "extra";
        $.publish("update", {
          tooth: `${tooth}`,
          surface: surface,
          newData: newData,
        });
      })
      .on("focus", function () {
        // deselect other elements
        removeAllSurfaceHighlights();
        hideAllToothDropdowns();
        hideAllCavityDropdowns();
      });

    $(".tooth").on("mouseenter", "img.tooth-center", function (e) {
      $(this).addClass("send-to-back");
    });
  }

  function subscribeToEvents() {
    $.subscribe("updated", function (e) {
      render();
    });
  }

  // end logic functions

  function render() {
    // clear all existing classes and charting images
    $("#tooth-chart path").removeClass(
      "amalgam-fill caries-fill composite-fill gic-fill temporary-fill staining-fill"
    );
    $(".tooth-center").remove();

    // get data from model
    const modelData = model.getModel();

    // loop through object
    for (const toothNumber in modelData) {
      // in each loop, find the dom object with data-tooth matching the key
      const tooth = $("#tooth-chart").find(
        `.tooth[data-tooth='${toothNumber}']`
      );

      // if the tooth is present
      if (tooth.length) {
        // loop through inner array
        for (const code in modelData[toothNumber]) {
          // find the dom object with the correct 'data-surface'
          const surface = tooth.find(
            `[data-tooth='${toothNumber}'][data-surface='${code}']`
          );

          if (
            code == "occlusal" ||
            code == "top" ||
            code == "bottom" ||
            code == "left" ||
            code == "right"
          ) {
            // if value == 1 --> change colour to amalgam, etc.
            if (modelData[toothNumber][code] == "1") {
              surface.addClass("amalgam-fill");
            } else if (modelData[toothNumber][code] == "2") {
              surface.addClass("caries-fill");
            } else if (modelData[toothNumber][code] == "3") {
              surface.addClass("composite-fill");
            } else if (modelData[toothNumber][code] == "4") {
              surface.addClass("gic-fill");
            } else if (modelData[toothNumber][code] == "5") {
              surface.addClass("temporary-fill");
            } else if (modelData[toothNumber][code] == "6") {
              surface.addClass("staining-fill");
            }
          } else if (code == "whole") {
            // render wholetooth codes
            var img = "";
            switch (modelData[toothNumber][code]) {
              case "M":
                img = createImage(
                  "images/missing-line.svg",
                  "tooth-center",
                  "missing tooth image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "FS":
                img = createImage(
                  "images/fissure-sealant.svg",
                  "tooth-center",
                  "fissure sealant image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "IMP":
                img = createImage(
                  "images/implant.svg",
                  "tooth-center",
                  "implant image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "PE":
                img = createImage(
                  "images/partially-erupted.svg",
                  "tooth-center",
                  "partialy erupted image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "BA":
                img = createImage(
                  "images/bridge-abutment.svg",
                  "tooth-center",
                  "bridge abutment image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "BP":
                img = createImage(
                  "images/bridge-pontic.svg",
                  "tooth-center",
                  "bridge pontic image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "PRR":
                img = createImage(
                  "images/preventative-resin-restoration.svg",
                  "tooth-center",
                  "PRR image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "FGC":
                img = createImage(
                  "images/full-gold-crown.svg",
                  "tooth-center",
                  "full gold crown image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "RE":
                img = createImage(
                  "images/recently-extracted.svg",
                  "tooth-center",
                  "recently extracted image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "F":
                img = createImage(
                  "images/fracture.svg",
                  "tooth-center",
                  "fracture image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "PBC":
                img = createImage(
                  "images/porcelain-bonded-crown.svg",
                  "tooth-center",
                  "porcelain bonded crown image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "PJC":
                img = createImage(
                  "images/porcelain-jacket-crown.svg",
                  "tooth-center",
                  "porcelain jacket crown image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "PV":
                img = createImage(
                  "images/porcelain-veneer.svg",
                  "tooth-center",
                  "porcelain veneer image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "CR":
                img = createImage(
                  "images/crown.svg",
                  "tooth-center",
                  "crown image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "A":
                img = createImage(
                  "images/artificial-tooth.svg",
                  "tooth-center",
                  "artificial tooth image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "FMC":
                img = createImage(
                  "images/full-metal-crown.svg",
                  "tooth-center",
                  "full metal crown image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "SC":
                img = createImage(
                  "images/space-closed.svg",
                  "tooth-center",
                  "space closed image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "RC":
                img = createImage(
                  "images/retained-c.svg",
                  "tooth-center",
                  "retained c image"
                );
                $(`.symbol-container[data-tooth='${toothNumber}']`).append(img);
                break;
              case "IN":
                if (toothNumber < 29) {
                  img = createImage(
                    "images/standing-arrow-down.svg",
                    "tooth-center",
                    "tooth instanding image"
                  );
                  $(`.symbol-container[data-tooth='${toothNumber}']`).append(
                    img
                  );
                } else {
                  img = createImage(
                    "images/standing-arrow-up.svg",
                    "tooth-center",
                    "tooth instanding image"
                  );
                  $(`.symbol-container[data-tooth='${toothNumber}']`).append(
                    img
                  );
                }
                break;
              case "OUT":
                if (toothNumber < 29) {
                  img = createImage(
                    "images/standing-arrow-up.svg",
                    "tooth-center",
                    "tooth outstanding image"
                  );
                  $(`.symbol-container[data-tooth='${toothNumber}']`).append(
                    img
                  );
                } else {
                  img = createImage(
                    "images/standing-arrow-down.svg",
                    "tooth-center",
                    "tooth outstanding image"
                  );
                  $(`.symbol-container[data-tooth='${toothNumber}']`).append(
                    img
                  );
                }
                break;
              case "RM":
                if (
                  (toothNumber > 10 && toothNumber < 19) ||
                  (toothNumber > 40 && toothNumber < 49)
                ) {
                  img = createImage(
                    "images/rotated-right-arrow.svg",
                    "tooth-center",
                    "tooth rotated mesially image"
                  );
                  $(`.symbol-container[data-tooth='${toothNumber}']`).append(
                    img
                  );
                } else {
                  img = createImage(
                    "images/rotated-left-arrow.svg",
                    "tooth-center",
                    "tooth rotated mesially image"
                  );
                  $(`.symbol-container[data-tooth='${toothNumber}']`).append(
                    img
                  );
                }
                break;
              case "RD":
                if (
                  (toothNumber > 10 && toothNumber < 19) ||
                  (toothNumber > 40 && toothNumber < 49)
                ) {
                  img = createImage(
                    "images/rotated-left-arrow.svg",
                    "tooth-center",
                    "tooth rotated distally image"
                  );
                  $(`.symbol-container[data-tooth='${toothNumber}']`).append(
                    img
                  );
                } else {
                  img = createImage(
                    "images/rotated-right-arrow.svg",
                    "tooth-center",
                    "tooth rotated distally image"
                  );
                  $(`.symbol-container[data-tooth='${toothNumber}']`).append(
                    img
                  );
                }
                break;
              default:
              // code block
            }
          } else if (code == "extra") {
            const extraText = $(`[data-tooth='${toothNumber}']`).children(
              "textarea"
            );
            extraText.val(modelData[toothNumber][code]);

            extraText.height("auto");
            const scrollHeight = parseInt(extraText.prop("scrollHeight")) - 10;
            extraText.height(scrollHeight);
          }
        }
      }
    }
  }

  setUpMainDropdowns();
  hideAllCavityDropdowns();
  hideAllToothDropdowns();
  setUpClickListeners();
  subscribeToEvents();
  setUpModal();
}

function main() {
  const chart = Chart();
  const model = ChartModel(chart);
  const controller = ChartController(model);
  const view = ChartView(model);

  model.loadChart();
}

$(document).ready(function () {
  main();
});
