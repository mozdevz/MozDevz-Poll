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

var usersRef = database.ref("users");

usersRef.on('value', function (snapshot) {
    usersList.innerHTML = "";
    //Don't list the current user's profile.
    var currentUid = firebase.auth().currentUser.uid;
    snapshot.forEach(function(snap){
        var user = snap.val();
        var userKey = snap.key;
        var buttonText;
        if(user.type == 'admin')
            buttonText = 'Remove privileges'
        else
            buttonText = 'Make Administrator';
        if(userKey != currentUid){
            var cardView ='<div class="user mdl-color-text--grey-700 mdl-card mdl-shadow--2dp">' +
                '<header class="user__header">' +
                '<img src="'+user.photo+'" class="user__avatar">' +
                '<div class="user__author">' +
                '<strong>'+user.name+'</strong>' +
                '<span>'+user.email+'</span>' +
                '</div>' +
                '</header>' +
                '<nav class="user__actions">' +
                '<button class="mdl-button mdl-js-button mdl-button--accent"' +
                ' onclick="changeUserType(\''+userKey+'\',\''+user.type+'\')">'
                +buttonText+'</button>' +
                '<button class="mdl-button mdl-js-button mdl-button--accent"' +
                ' onclick="deleteUser(\''+userKey+'\')">' +
                'Delete Account</button>' +
                '</nav></div>';
            usersList.innerHTML = usersList.innerHTML + cardView;
        }
    });
});

function deleteUser(userKey){
    showDialog({
        title: 'Delete User?',
        text: 'This will remove all the user data, but he will still be able to sign up again.',
        positive: {
            title: 'No'
        },
        negative: {
            title: 'Yes',
            onClick: function (e) {
                usersRef.child(userKey).remove();
            }
        }
    });
}

function changeUserType(userKey, userType){
    var title, text, type;
    if(userType == 'admin')
    {
        title = 'Remove privileges';
        text = 'The user will no longer be able to access the administration dashboard.';
        type='user';
    }
    else{
        title = 'Make Administrator';
        text = 'The user will get privileges to access the administration dashboard';
        type='admin';
    }
    showDialog({
        title: title,
        text: text,
        positive: {
            title: 'No'
        },
        negative: {
            title: 'Yes',
            onClick: function () {
                usersRef.child(userKey).update({type:type});
            }
        }
    });
}