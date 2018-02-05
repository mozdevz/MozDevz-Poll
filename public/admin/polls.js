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

var database = firebase.database();

var pollsRef = database.ref("polls");
var questionsRef = database.ref("questions");
var resultsRef = database.ref("results");

pollsRef.orderByChild("dateCreated").on('value', function (snapshot) {
    pollsList.innerHTML = "";
    snapshot.forEach(function(snap){
        var poll = snap.val();
        var pollKey = snap.key;
        var cardView = '<tr> <td class="mdl-data-table__cell--non-numeric">'+
            poll.title.substring(0,25)+'...</td>'+
            '<td class="mdl-layout--large-screen-only">'+
            new Date(poll.dateCreated).toDateString()
            +'</td>'+
            '<td class="mdl-layout--large-screen-only">'+
            new Date(poll.dateExpiration).toDateString()
            +'</td>'+
        '<td>'+
            '<a class="mdl-button mdl-js-button mdl-button--icon"'+
            'href="poll.html#'+pollKey+'"><i class="material-icons">sort</i></a>'+
        /*'<a class="mdl-button mdl-js-button mdl-button--icon"'+
        'href="editPoll.html#'+pollKey+'"><i class="material-icons">edit</i></a>'+*/
        '<a class="mdl-button mdl-js-button mdl-button--icon"'+
        'onClick="deletePoll(\''+pollKey+'\')"><i class="material-icons">delete</i></a>'+
        '</td>'+
        '</tr>';
        pollsList.innerHTML = pollsList.innerHTML + cardView;
    });
});

function deletePoll(pollKey){
    showDialog({
        title: 'Delete Poll?',
        text: 'This will permanently remove all the data collected with it.',
        positive: {
            title: 'No'
        },
        negative: {
            title: 'Yes',
            onClick: function (e) {
                pollsRef.child(pollKey).remove();
                questionsRef.child(pollKey).remove();
                resultsRef.child(pollKey).remove();
            }
        }
    });
}