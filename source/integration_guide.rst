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

      $ npm install https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-v0.0.21.tgz

    or 

    .. code-block:: bash

      $ yarn add https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-v0.0.21.tgz

  * Minified library

    You can also download the latest minified version `here <https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-0.0.21.min.js>`_ and include it in your project.  

    .. code-block:: html

      <script type="text/javascript" src="aq-miniapp-core-0.0.21.min.js"></script>

    The AQ Core Library is exposed in your app via ``window.AQCore``.

    .. code-block:: javascript

      // Access lifecycle class 
      var LifeCycle = window.AQCore.LifeCycle;    

  * Construct 2

    The JSLink plugin can downloaded `here <https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-js-link-1.8.zip>`_. Extract this to 
    ``C:\Program Files\Construct 2\exporters\html5\plugins``. The library will be available as a Construct 2 object named ``AQJSLink``.

Setup the mini-app
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Objective:* Prepare the mini-app to receive and use information from the host app.

* Look for init or constructor in the main function of the mini-app and call ``LifeCycle.setOnDataCallback()`` and ``LifeCycle.setOnResetCallback()`` 
  to receive data from the host app. 

  .. note::

    * ``LifeCycle.setOnDataCallback()`` sets the handler for the ``onData`` event.  This function accepts a callback function as a parameter.
    * ``LifeCycle.setOnResetCallback()`` sets the handler for the ``onReset`` event.  This function accepts a callback function as a parameter.
    * ``onData`` event occurs when the host app sends information required to setup the mini-app. 
    * ``onReset`` event occurs when the host app instructs the mini-app to reset the game to its initial state, along with some information that might be
      different from the ``onData`` event. 

* Use the information received from the host app in the mini-app

Call ``LifeCycle.informReady()``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Objective:*	Inform the host app that the mini-app is ready to be displayed.

* Check if all the setup data has been loaded
* Call ``LifeCycle.informReady()``

Call ``LifeCycle.setResult()``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Objective:*	Pass the result back to the host app as soon as the result is available.

* Call the function LifeCycle.setResult() when a result is already available from the mini app, but it has not ended yet.
  ``LifeCycle.setResult()`` tells the Host app that the result of the current play is available.

* Generate the JSON data to be sent back to the host app using the schema below:

.. code-block:: javascript

  {
    // General game result  
    winCriteria: AQCore.WIN_CRITERIA_WIN,
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

Call ``LifeCycle.end()``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

*Objective:*	Inform the host app that the mini-app can be closed.

* Display the result screen for 5 seconds then blur the screen
* Call ``LifeCycle.end()``. This function tells the host app that the current play of the mini-app 
  has ended and that the host app can display succeeding screens. 

Test the mini-app in the simulator
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Please see the :doc:`simulator` section for more information on how to test your mini-app.

Submit the project
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

