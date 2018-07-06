Game Extensions
==============================================================

Aside from integrating your mini app, the AQ Host app also provides additional functionalities to enhance the gameplay of your app.
The AQ MiniApp Core Library provides a ``GameExtensions`` class to access these functionalities.

Importing the class to your app
----------------------------------

Access the ``GameExtensions`` class from the global ``AQCore`` instance or import it from the ``aq-miniapp-core`` module. 

.. code-block:: javascript

  var GameExtensions = AQCore.GameExtensions;
  
  // Access various GameExtensions methods
  GameExtensions.createUserBet();
  
.. code-block:: javascript

  // ES6 syntax
  import { GameExtensions } from 'aq-miniapp-core';
  
  // Access various GameExtensions methods
  GameExtensions.createUserBet();

Creating a User-to-User Bet
----------------------------

If your game comprises of two players,  you can create a user-to-user bet with another user of the AQ App. Each player agrees to place a
bet and whoever wins the game will get win both amounts and added to his or her balance.

To accomplish this, you need to call ``GameExtensions.createUserBet``. This function will return a ``Promise`` that will give you the info
of the other user when fulfilled. The actual bet creation process and amount is taken care by the AQ Host App and is alreadt transparent
to your app.


.. code-block:: javascript

  var otherUser;

  GameExtensions.createUserBet()
    .then(function(result) {
      // result is in the following schema:
      // {
      //   id: string,
      //   displayName: string,
      //   avatarBig: string,
      //   avatarSmall: string
      // }

      // Save otherUser for claiming bet winnings
      otherUser = result;
      
      console.log('You have created a user-to-user bet with ' + result.displayName);
    })
    .catch(function(error){
      console.log('Unable to create a user-to-user bet:' + error.message);
    });


.. code-block:: javascript

  // ES6 syntax

  var otherUser;

  GameExtensions.createUserBet()
    .then((result) => {
      // result is in the following schema:
      // {
      //   id: string,
      //   displayName: string,
      //   avatarBig: string,
      //   avatarSmall: string
      // }
      
      // Save otherUser for claiming bet winnings
      otherUser = result;
      
      console.log('You have created a user-to-user bet with ' + result.displayName);
    })
    .catch((error) => {
      console.log('Unable to create a user-to-user bet:' + error.message);
    });


Claiming a User-to-User Bet
----------------------------    

At the end of your gameplay, either the current user wins, the other user wins, or nobody wins (draw). 
You can call the ``GameExtensions.claimBet`` method to tell the AQ App the result of the bet.

The ``claimBet`` method takes the id of the user who won the bet (either the current or the other user as supplied
by the previous call to ``createUserBet``. If the gameplay resulted in a draw, pass null as the parameter
to ``claimBet``.

.. code-block:: javascript

  // otherUser contains user info from previous call to createBet
  var otherUser;

  // Assume otherUser wins
  GameExtensions.claimUserBet(otherUser.id)
    .then(function(result) {
      console.log('You have successfully given the bet winnings to ' + otherUser.displayName);
    })
    .catch(function(error){
      console.log('Unable to claim a user-to-user bet:' + error.message);
    });

.. code-block:: javascript

  // ES6 syntax

  // otherUser contains user info from previous call to createBet
  var otherUser;

  // Assume otherUser wins
  GameExtensions.claimUserBet(otherUser.id)
    .then((result) => {
      console.log('You have successfully given the bet winnings to ' + otherUser.displayName);
    })
    .catch((error) => {
      console.log('Unable to claim a user-to-user bet:' + error.message);
    });    




