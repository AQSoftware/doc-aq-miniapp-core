Integration Guide
==============================================================

These are the steps to integrate the AQ MiniApp Core JS Library to your project. The details
in each step may differ depending on which framework you're using. The aim is to have an overall
structure of integrating the library.

Start the project
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#. Open your mini-app.
#. Download the required plugins, depending on which framework you're using:

  * NPM

    .. code-block:: bash

      $ npm install https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-v0.0.15.tgz

    or 

    .. code-block:: bash

      $ yarn add https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-v0.0.15.tgz

  * Minified library

    You can also download the latest minified version `here <https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-0.0.15.min.js>`_ and include it in your project.  

    .. code-block:: html

      <script type="text/javascript" src="aq-miniapp-core-0.0.15.min.js"></script>

    The AQ Core Library is exposed in your app via ``window.AQCore``.

    .. code-block:: javascript

      // Access lifecycle class 
      var defaultLifeCycle = window.AQCore.defaultLifeCycle;    

  * Construct 2

    The JSLink plugin can downloaded `here <http://fma-sdk.s3-website-ap-southeast-1.amazonaws.com/sdk/jslink-1.0.2.zip>`_. Extract this to 
    ``C:\Program Files\Construct 2\exporters\html5\plugins``. The library will be available as a Construct 2 object named ``AQJSLink``.

Setup the mini-app
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Objective:* Prepare the mini-app to receive and use information from the host app.

* Look for init or constructor in the main function of the mini-app and call ``defaultLifeCycle.setOnDataCallback()`` and ``defaultLifeCycle.setOnResetCallback()`` 
  to receive data from the host app. 

  .. note::

    * ``defaultLifeCycle.setOnDataCallback()`` sets the handler for the ``onData`` event.  This function accepts a callback function as a parameter.
    * ``defaultLifeCycle.setOnResetCallback()`` sets the handler for the ``onReset`` event.  This function accepts a callback function as a parameter.
    * ``onData`` event occurs when the host app sends information required to setup the mini-app. 
    * ``onReset`` event occurs when the host app instructs the mini-app to reset the game to its initial state, along with some information that might be
      different from the ``onData`` event. 

* Use the information received from the host app in the mini-app

Call ``defaultLifecycle.informReady()``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Objective:*	Inform the host app that the mini-app is ready to be displayed.

* Check if all the setup data has been loaded
* Call ``defaultLifeCycle.informReady()``

Call ``defaultLifecycle.setResult()``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Objective:*	Pass the result back to the host app as soon as the result is available.

* Call the function defaultLifeCycle.setResult() when a result is already available from the mini app, but it has not ended yet.
  ``defaultLifeCycle.setResult()`` tells the Host app that the result of the current play is available.

* Generate the JSON data to be sent back to the host app using the schema below:

.. code-block:: javascript

  {
    // Pass true to winCriteriaPassed if game has been won, 
    // or false if user lost the game
    winCriteriaPassed: true,
    // Score of the game. This field is optional if it is 
    // not logical for the game to have a score
    // You can also specify the score as an actual-target value like this:
    //
    // score: {
    //   value: 10,
    //   target: 20
    // }
    //
    score: {
      value: 10
    },
    // A valid image url, (usually a screenshot) of the game result
    resultImageUrl: 'http://example.com/example.jpg'
  }

Call ``defaultLifecycle.end()``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Objective:*	Inform the host app that the mini-app can be closed.

* Display the result screen for 5 seconds then blur the screen
* Call ``defaultLifeCycle.end()``. This function tells the host app that the current play of the mini-app 
  has ended and that the host app can display succeeding screens. 

Test the mini-app in the simulator
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Please see the :doc:`simulator` section for more information on how to test your mini-app.

Submit the project
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

   .. code-block:: javascript

     var defaultLifeCycle = AQCore.defaultLifeCycle;

     // An example function that is called after all the assets has been loaded
     function onLoadAssets() {
       defaultLifeCycle.informReady();
     }

   .. code-block:: javascript

     // ES6 syntax
     import { defaultLifeCycle } from 'aq-miniapp-core';

     class MyGame {
      
       // An example function that is called after all the assets has been loaded
       onLoadAssets() {
         defaultLifeCycle.informReady();
       }  
     }

#. ``defaultLifeCycle.setResult()`` - This function tells the Host app that the result for the current invocation of your mini app 
   is available, but the mini app itself has not yet ended. The result is currently in the form of a numeric score, either as a constant
   or a actual-target component (e.g. 10 out of 20). You also specify an image result for your gameplay (e.g. a screenshot with the score)
   as a valid URL.
   
   Example usage:

   .. code-block:: javascript

     var defaultLifeCycle = AQCore.defaultLifeCycle;

     // An example function that is called when your game (mini app)'s result is available
     function onScoreAvailable(score) {
       var param = {
        // Pass true to winCriteriaPassed if game has been won, 
        // or false if user lost the game
        winCriteriaPassed: true,
        // Score of the game. This field is optional if it is 
        // not logical for the game to have a score
        score: {
          value: score
        },
        // A valid image url, (usually a screenshot) of the game result
        resultImageUrl: 'http://example.com/example.jpg'
       }

       // You can also specify the score as an actual-target value like this:
       //
       // score: {
       //   value: 10,
       //   target: 20
       // }
       // 

       defaultLifeCycle.setResult(param);
     }

   .. code-block:: javascript

     // ES6 syntax
     import { defaultLifeCycle } from 'aq-miniapp-core';

     class MyGame {
      
      // An example function that is called when your game (mini app)'s result is available
      onScoreAvailable(score) {
         var param = {
            // Pass true to winCriteriaPassed if game has been won, 
            // or false if user lost the game
            winCriteriaPassed: true,
            // Score of the game. This field is optional if it is 
            // not logical for the game to have a score
            score: {
              value: score
            },
            // A valid image url, (usually a screenshot) of the game result
            resultImageUrl: 'http://example.com/example.jpg'
         }

         // You can also specify the score as an actual-target value like this:
         //
         // score: {
         //   value: 10,
         //   target: 20
         // }
         // 
         defaultLifeCycle.setResult(param);
       }  
     }

#. ``defaultLifeCycle.end()`` - This function tells the Host app that the current invocation of your mini app has 
   ended, usually when your game is over. When this is called, you signal the Host app that it can already display
   succeeding screens relevant to the current game play.

   Example usage:

   .. code-block:: javascript

     var defaultLifeCycle = AQCore.defaultLifeCycle;

     // An example function that is called when your game (mini app) has ended
     function onGameEnd() {
       defaultLifeCycle.end();
     }

   .. code-block:: javascript

     // ES6 syntax
     import { defaultLifeCycle } from 'aq-miniapp-core';

     class MyGame {
      
       // An example function that is called when your game (mini app) has ended
       onGameEnd() {
         defaultLifeCycle.end();
       }  
     }

  
