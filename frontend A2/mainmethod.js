$(document).ready(function () {

    $('.no-result').hide();
    $('.invalid').hide();

    $("#upload-photo").on('click', function (e) {
        let files = document.getElementById("file").files;
        if (!files.length) {
          return alert("Please choose a file to upload first.");
        }
        let file = files[0];
        let fileName = file.name;
        console.log(fileName);

        /* call put api to upload */
        upload(fileName, file);

    });

    /* key press in input field to trigger search_photo */
    $('#input').keypress(function (e) {
        if (e.which == 13) {
            search_photo();
        }
    });

    /* click on search icon to trigger search_photo */
    $('#search').on('click', function (e) {
        search_photo();
    });

    /*click the microphone icon, real time voice to text will be triggered */
    $('#voice').on('click',function(e){
        voice();
    });

    /* upload photo */
    function upload(fileName, file) {
      let labels = $('#labels').val();
      console.log(labels);
      console.log(file);

      let url = "https://xrip8jh607.execute-api.us-east-1.amazonaws.com/test/upload/photo-6998/" + fileName;

      fetch(url, {
                  method: 'PUT',
                  headers: {
                      "X-Api-Key":'MCkpS9239R8dzEkkRPUpX7OTVRLlAu4p7aHwfdEj',
                      "x-amz-meta-customLabels": labels,
                      "Content-Type": file.type
                  },
                  body: file
            }).then(response => {
            }).then(data => console.log(data));

      console.log('upload success');
      $('#labels').val('');
      $('#upload_success').text('upload success');

    };

    /* find photo */
    function search_photo() {
        search_term = $('#input').val();

        search_trim = search_term.trim();
        console.log(search_trim);

        if (search_trim == '') {
            $('.invalid').show();
            $('#input').focus();
            $('.no-result').hide();
            return false;
        }

        SearchApi(search_trim)
            .then((response) => {
                console.log(response);
                $('#input').val('');
                $('#input').focus();
                $('.invalid').hide();
                $('#instruction').hide();
                $('.photos').html("");

                data = response['data'];
                console.log(data);

                if (data == "") {
                    $('.no-result').show();
                    return;
                }
                $('.no-result').hide();
                var result = $('.photos');
                let url = 'https://s3.amazonaws.com/photo-6998/';
                for (i = 0; i < data.length; i++) {
                  new_url = url +  data[i];
                  console.log(new_url);

                  let image = document.createElement("img");
                  image.src = new_url;
                  image.alt = data[i];

                  let div = document.createElement("div");
                  div.append(image);
                  div.setAttribute('id', 'photo');
                  div.setAttribute('class', 'col-md-3');
                  div.setAttribute('style', 'display:inline');

                  result.append(div);
                }
            })
            .catch((error) => {
                alert('error');
                console.log('error: ', error);
            });
    }

    function SearchApi(keys) {

        var apigClient = apigClientFactory.newClient({
          apiKey: "MCkpS9239R8dzEkkRPUpX7OTVRLlAu4p7aHwfdEj"
        });

        var body = {};
        var params = {'q': keys};
        var additionalParams = {
          headers: {
            /*"X-Api-Key": "MCkpS9239R8dzEkkRPUpX7OTVRLlAu4p7aHwfdEj",*/
            "Content-Type": "application/json"
          }
        }

        console.log(apigClient.searchGet(params,body,additionalParams));

        return apigClient.searchGet(params,body,additionalParams);
    }

    function voice(){
        var speechRecognition = window.webkitSpeechRecognition;
        var recognition = new speechRecognition();
        var textbox = $('#input');

        var content = '';
        recognition.continuous = true;

        // recognition start
        recognition.onstart = function(){
          $('#instruction').text('Voice Recognition is on');
        }

        recognition.onspeechend = function(){
          recognition.stop();
          $('#instruction').text('Voice recognition has stopped');
        }

        $('#stop').on('click',function(e){
          recognition.stop();
          $('#instruction').text('Voice recognition stopped');
        })

        recognition.onerror = function(){
          $('#instruction').text('Try Again');
        }

        recognition.onresult = function(event){
          var current = event.resultIndex;
          var transcript = event.results[current][0].transcript;

          content = transcript;

          textbox.val(content);

          textbox.focus();
        }

        if (content.length){
          content += ''
        }

        recognition.start();


    }

})
