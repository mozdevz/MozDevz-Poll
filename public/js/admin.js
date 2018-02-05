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

initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var uid = user.uid;
            var userRef = firebase.database().ref('users').child(uid);
            userRef.on('value', function(snapshot){
                var user = snapshot.val();
                document.getElementById('navBarName').innerHTML = user.name;
                document.getElementById('navBarEmail').innerHTML = user.email;
                document.getElementById('navBarPhoto').src = user.photo;
                if(user.type != 'admin')
                    window.location.assign('../index.html');

            });
        } else {
            window.location.assign('../index.html');
        }
    }, function(error) {
        console.log(error);
    });
};
window.addEventListener('load', function() {
    initApp()
});