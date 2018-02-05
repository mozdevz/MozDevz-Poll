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

var questionsRef = database.ref("questions");

var hash = window.location.hash;
if(hash)
{
    var questionKey = hash.substring(1);
    questionsRef.child(questionKey).on('value', function (snapshot) {
        optionsList.innerHTML = "";
        snapshot.forEach(function (snap) {
            var option = snap.val();
            var optionKey = snap.key;

            var itemView = '<span class="mdl-chip mdl-chip--deletable">\n' +
                '<span class="mdl-chip__text">'+option.question+'</span>\n' +
                '<button type="button" onclick="removeOption(\''+optionKey+'\')'+
                '" class="mdl-chip__action">\n' +
                '<i class="material-icons">cancel</i></button>\n' +
                '</span><br>';
            optionsList.innerHTML = optionsList.innerHTML +itemView;
        });

    });
}
else
{
    window.history.back();
}

function removeOption(optionKey)
{
    var questionKey = hash.substring(1);
    questionsRef.child(questionKey).child(optionKey).remove();
}

btnAdd.addEventListener('click', function (e) {
    var questionKey = hash.substring(1);
    var question = document.getElementById('pollOption').value;
    questionsRef.child(questionKey).push().set({
        question:question,
        votes:0,
        uid:firebase.auth().currentUser.uid
    }).then(function () {
        document.getElementById('pollOption').value = "";
    });
});