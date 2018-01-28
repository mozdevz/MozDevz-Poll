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
var resultsRef = db.ref('results');
var usersRef = db.ref('users');

var votes = [];

//Check if user is authenticated
initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var photoURL = user.photoURL;
            var uid = user.uid;

            //Add user to database
            usersRef.child(uid).set({
                email:email,
                name:displayName,
                photo:photoURL,
                type:'user'
            });

            pollsRef.orderByChild('dateCreated')
                .limitToLast(1).on('value', function (snapshot) {
                    //Get the current Poll data
                    snapshot.forEach(function (snap) {
                        //Check if user has already voted
                        resultsRef.child(snap.key)
                            .child(uid).once('value', function(s){
                            if(s.exists() == true)
                                confirmVote(snap.val().confirmation);
                            else
                                loadPoll(snap);
                        })
                    });
            });

            //Add listener to SignOut button
            btnLogOut.addEventListener('click', function (e) {
                firebase.auth().signOut().then(function() {
                    //User signed out. Take him back to the auth screen
                    window.location.replace('index.html');
                }, function(error) {
                    console.error('Sign Out Error', error);
                });
            });

            //Add listener to Delete button
            btnDeleteUser.addEventListener('click', function (e) {
                showDialog({
                    title: 'Desactivar Conta?',
                    text: 'Isto irá eliminar todos os seus registos na plataforma.',
                    negative: {
                        title: 'Desactivar',
                        onClick:function () {
                            firebase.auth().currentUser.delete().then(function() {
                                //Take user back to the auth screen
                                window.location.replace('index.html');
                            }, function(error) {
                                console.error('Error', error);
                                showDialog(({title:'Error',text:error.message,neutral:{title:'Ok'}}))
                            });
                        }
                    },
                    positive:{
                        title:'Cancelar'
                    }
                });

            });

        } else {
            //User is signed out. Take him back to the auth screen
            window.location.replace('index.html');
        }
    }, function(error) {
        //Couldn't check user's auth status. Log the error and
        //Take him back to the auth screen
        console.log(error);
        window.location.replace('index.html');
    });
};

window.addEventListener('load', function() {
    initApp();
});

function loadPoll(snap){
    var poll = snap.val();
    pollTitle.innerHTML = poll.title;
    pollDescription.innerHTML = poll.description;

    //Hide the progressBar
    progressBar.style.display = 'none';

    //Read and display each option
    questionsRef.child(snap.key)
        .orderByChild('votes').once('value', function(snapshot){
        pollQuestions.innerHTML = "";//Clear the pollQuestions element
        snapshot.forEach(function (q){
            var option = q.val();
            votes[q.key] = option.votes;
            var cardView = '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" ' +
                'for="option-'+q.key+'">' +
                '<input type="radio" id="option-'+q.key+'" class="mdl-radio__button" ' +
                ' name="options" value="'+q.key+'"> ' +
                '<span class="mdl-radio__label" id="'+q.key+'">'+option.question+'</span> ' +
                '</label><br>';
            //pollQuestions.appendChild(cardView);
            pollQuestions.innerHTML = cardView + pollQuestions.innerHTML;
        });
        //Add the `other` option to the end
        var otherOption = '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" ' +
            'for="option-other">' +
            '<input type="radio" id="option-other" class="mdl-radio__button" ' +
            ' name="options" value="0" onclick="showTextField()"> ' +
            '<span class="mdl-radio__label" id="other">Outro:</span> ' +
            '</label><br>';
        pollQuestions.innerHTML = pollQuestions. innerHTML + otherOption;
    });
    //snap.child('questions')


    //Display the vote button
    btnVote.style.display = 'inline-block';
    //onClickListener for the vote button
    btnVote.addEventListener('click', function (e) {
        var radioButtons = document.getElementsByName("options");
        var selectedOp; //The option selected
        for(var i = 0; i<radioButtons.length; i++)
        {
            if(radioButtons[i].checked)
                selectedOp = radioButtons[i].value;
        }
        var uid = firebase.auth().currentUser.uid;
        if(selectedOp == 0)
        {
            var suggestion = otherSuggestion.value;
            if(suggestion == "" || suggestion == null)
            {
                showDialog({
                    title: 'Especifique o tema',
                    text: 'Você escolheu "outro". Por favor preencha o campo de texto.',
                    neutral: {
                        title: 'Ok'
                    }
                });
            }
            else
            {
                var pushId = questionsRef.push().key;
                resultsRef.child(snap.key).child(uid).set(pushId);

                questionsRef.child(snap.key).child(pushId).set({
                    question:suggestion,
                    uid:uid,
                    votes:1
                });
                otherSuggestion.value = "";
                confirmVote(poll.confirmation);
            }
        }
        else{
            resultsRef.child(snap.key).child(uid).set(selectedOp);
            questionsRef.child(snap.key)
                .child(selectedOp).update({
                votes:(votes[selectedOp]+1)
            });
            confirmVote(poll.confirmation);
        }
    });
}

function confirmVote(confirmationMessage){
    pollTitle.innerHTML = "Voto registado!";
    pollDescription.innerHTML = confirmationMessage;
    btnVote.style.display = 'none';
    pollQuestions.style.display = 'none';
    textField.style.display = 'none';
    progressBar.style.display = 'none';
}

function showTextField()
{
    textField.style.display = 'inline-block';
}
