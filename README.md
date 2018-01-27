MozDevz-Poll
===========

[MozDevz Poll](https://mozdevz-poll.firebaseapp.com) é uma aplicação web que permite que os membros da comunidade votem para escolher o tema do próximo Meetup organizado por ela.

#Como executar
A aplicação foi desenvolvida utilizando Firebase, por isso, necessita de um projecto Firebase.

##Configurar Firebase na Consola
1. Vá à [consola do firebase](https://console.firebase.google.com) e crie um novo projecto.
2. Selecione o seu projecto e entre na aba "Database" e selecione "Realtime Database".
3. Na Aba "Regras", substitua as regras pré-definidas pelas regras contidas no ficheiro `database.rules.json`.
4. Volte para o "Project Overview" e clique em "Adicionar um app web"
5. Copie as configurações mostradas e coloque no ficheiro `js/config.js`

##Configurar Firebase na CLI
1. Abra a linha de comandos no directório `MozDevz-Poll`.
2. Caso você ainda não tenha, instale a [Firebase CLI](https://firebase.google.com/docs/cli/?hl=pt-pt).
3. Utilize o comando `firebase login` para autenticar a CLI com a sua conta do Firebase.
4. Depois de autenticado, utilize o comando `firebase init` para inicializar um projecto Firebase nesse directório.
5. Selecione as opções "Database" e "Hosting".
6. O ficheiro para regras é o `database.rules.json` e o directório público é o `public`. **Não reescreva** todas rotas para `index.html`.
7. Execute o projecto localmente, utilizando o comando `firebase serve`

#Contribuir
É só enviar um Pull Request. Qualquer tipo de contribuição será aceite. :)

Licença
=======

    Copyright 2018 MozDevz

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.