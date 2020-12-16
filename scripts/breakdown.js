//Reusing basic gallery code I (Kurt Huebner) wrote for a project in 1300. This shouldn't be an issue as this is fairly trivial.
//When DOM is loaded:
$(document).ready(function () {
  $.getScript("scripts/oklahoma.js", function() {
    oklahomaWrapper();
  });
    // When the next button is clicked
    $("#oklahoma_button").on("click", function () {

      if ($(".slideshowImage").attr("id") != "oklahoma"){
        //Mixing d3 and jQuery here. I know.
        d3.select(".slideshowImage").selectAll('*').remove();
        $(".slideshowImage").attr("id", "oklahoma");
        $.getScript("scripts/oklahoma.js", function() {
          oklahomaWrapper();
       });
      }
    });

    $("#west_virginia_button").on("click", function () {

      if ($(".slideshowImage").attr("id") != "west_virginia"){
        //Mixing d3 and jQuery here. I know.
        d3.select(".slideshowImage").selectAll('*').remove();
        $(".slideshowImage").attr("id", "west_virginia");
        $.getScript("scripts/West Virginia.js", function() {
          wvWrapper();
       });
      }
    });

    $("#mississippi_button").on("click", function () {

      if ($(".slideshowImage").attr("id") != "mississippi"){
        //Mixing d3 and jQuery here. I know.
        d3.select(".slideshowImage").selectAll('*').remove();
        $(".slideshowImage").attr("id", "mississippi");
        $.getScript("scripts/mississippi.js", function() {
          mississippiWrapper();
       });
      }
    });
  });