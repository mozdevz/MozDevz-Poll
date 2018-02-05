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

btnNext.addEventListener('click', function (e) {
    var title = document.getElementById('pollTitle').value;
    var description = document.getElementById('pollDescription').value;
    var expiration = document.getElementById('pollExpiration').value;
    var confirmation = document.getElementById('pollConfirmation').value;
    var dateCreated = new Date();
    var dateExpiration = dateCreated.addDays(parseInt(expiration));

    var pollKey = pollsRef.push().key;
    pollsRef.child(pollKey).set({
        title:title,
        description:description,
        dateCreated : dateCreated.getTime(),
        dateExpiration: dateExpiration.getTime(),
        confirmation:confirmation
    }).then(function () {
        window.location.replace('newQuestions.html#'+pollKey);
    });

});

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}