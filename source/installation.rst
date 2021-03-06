Installation
==================

Adding AQ Miniapp Core to a New Application
---------------------------------------------

The easiest way to get started on a new mini app project is by using the boilerplate code provided.

.. code-block:: bash

  $ git clone https://bitbucket.org/aqsoftware/aq-miniapp-base-pixi.git my-first-miniapp

The boilerplate code is setup as a `PixiJS  <http://www.pixijs.com/>`_ project with all the details of connecting to the AQ Host App already encapsulated so you can focus on developing your game. If you need more precise control over your project or you want to integrate it to an existing one, you can install the library manually as described in the next section.


Manually installing the AQ Miniapp Core Library
----------------------------------------------------

If you can install the core library as an NPM module:

.. code-block:: bash

  $ npm install https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-v0.0.21.tgz

or 

.. code-block:: bash

  $ yarn add https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-v0.0.21.tgz

  
You can also download the latest minified version at:

https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-0.0.21.min.js 

and include it in your project.  

.. code-block:: html

  <script type="text/javascript" src="aq-miniapp-core-0.0.21.min.js"></script>

The AQ Core Library is exposed in your app via ``window.AQCore``.

.. code-block:: javascript

  // Access lifecycle class 
  var LifeCycle = window.AQCore.LifeCycle;  

There is also a plugin available for Construct 2. The JSLink plugin can downloaded at 

https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-js-link-1.8.zip

Extract this to ``C:\Program Files\Construct 2\exporters\html5\plugins``. The library will be available as a Construct 2 object named ``AQJSLink``.


Now that you have installed the required dependencies, head over to the Integration Guide.  



