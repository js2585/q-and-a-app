$(".upvote").on("submit", function(e){
    e.preventDefault();
    var formAction = $(this).attr("action");
    var formData = $(this).serialize();
    $.ajax({
        url: formAction,
        data: formData,
        type: "POST",
        success: function(data){
            $("#" + data._id).text(data.upvotes.length);
        }
    });
});