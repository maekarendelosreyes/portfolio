jQuery(document).ready(function ($) {
  "use strict";

  // Initialize EmailJS with your user ID
  emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

  // Contact Form Submission
  $("form.contactForm").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    var form = $(this);
    var f = form.find(".form-group");
    var ferror = false;

    // Validate inputs
    f.children("input, textarea").each(function () {
      var i = $(this); // Current input/textarea
      var rule = i.attr("data-rule");

      if (rule !== undefined) {
        var ierror = false; // Error flag for current field
        var pos = rule.indexOf(":", 0);
        var exp = pos >= 0 ? rule.substr(pos + 1, rule.length) : null;
        rule = pos >= 0 ? rule.substr(0, pos) : rule;

        switch (rule) {
          case "required":
            if (i.val() === "") {
              ferror = ierror = true;
            }
            break;

          case "minlen":
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case "email":
            var emailExp = /^[^\s()<>@,;:\\/]+@\w[\w.-]+\.[a-z]{2,}$/i;
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }

        i.next(".validation")
          .html(
            ierror
              ? i.attr("data-msg") !== undefined
                ? i.attr("data-msg")
                : "Invalid input"
              : ""
          )
          .show("blind");
      }
    });

    if (ferror) return false;

    // Prepare form data for EmailJS
    var formData = form.serializeArray().reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    var serviceID = "service_itpwt2e"; // Replace with your EmailJS service ID
    var templateID = "template_7pmxaco"; // Replace with your EmailJS template ID

    emailjs
      .send(serviceID, templateID, formData)
      .then(function (response) {
        $("#sendmessage").addClass("show");
        $("#errormessage").removeClass("show");
        form.find("input, textarea").val("");
      })
      .catch(function (error) {
        $("#sendmessage").removeClass("show");
        $("#errormessage").addClass("show");
        $("#errormessage").html("Failed to send message. Please try again.");
        console.error("EmailJS Error:", error);
      });

    return false;
  });
});
