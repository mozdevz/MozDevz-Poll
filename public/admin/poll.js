/*
 * Copyright 2018 MozDevz
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//get the firebase realtime database instance
var db = firebase.database();

//constant realtime-database references
var pollsRef = db.ref('polls');
var questionsRef = db.ref('questions');

var hash = window.location.hash;
if(hash){
    var pollKey = hash.substring(1);
    pollsRef.child(pollKey).on('value', function (snapshot) {
        var poll = snapshot.val();
        document.getElementById('pollTitle').innerHTML = poll.title;
        document.getElementById('pollDescription').innerHTML = poll.description;
    });

    questionsRef.child(pollKey).orderByChild('votes')
        .on('value', function (snapshot) {
            var totalVotes = 0;
            var votes = [];
            var i = 0;
            pollQuestions.innerHTML = "";
            snapshot.forEach(function(snapshot){
                var question = snapshot.val();
                totalVotes+= question.votes;
                votes[i] = question.votes;
                var item = '<h5 id="title'+i+'">'+question.question+'</h5>' +
                    '<div class="votes-progress-background">' +
                    '<div class="votes-progress" id="p'+i+'"></div>' +
                    '</div>' +
                    '<p>'+question.votes+' votes</p>' +
                    '<br>';
                pollQuestions.innerHTML = item +pollQuestions.innerHTML;
                i++;
            });
            for(var j=0; j<votes.length;j++)
            {
                var percentage=(votes[j]*100)/totalVotes;
                percentage = percentage.toFixed(2);
                document.getElementById('p'+j).style = 'width:'+percentage+'%';
                document.getElementById('title'+j).innerHTML =
                    document.getElementById('title'+j).innerHTML +' '+percentage+'%';
            }
        });
}
else
{
    window.history.back();
}