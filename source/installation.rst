Installation
==================

Adding AQ Miniapp Core to a New Application
---------------------------------------------

The easiest way to get started on a new mini app project is by using the boilerplate code provided.

.. code-block:: bash

  $ git clone https://bitbucket.org/aqsoftware/aq-miniapp-base-pixi.git my-first-miniapp

The boilerplate code is setup as a `PixiJS  <http://www.pixijs.com/>`_ project with all the details of connecting to the AQ Host App already encapsulated so you can focus on developing your game. If you need more precise control over your project or you want to integrate it to an existing one, you can install the library manually as described in the next section.


Manually installting the AQ Miniapp Core Library
----------------------------------------------------

You can install the core library as an NPM module:

.. code-block:: bash

  $ npm install https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-v0.0.14.tgz

or 

.. code-block:: bash

  $ yarn add https://s3-ap-southeast-1.amazonaws.com/funminiapps/sdk/aq-miniapp-core-v0.0.14.tgz

  
You can also download the latest minified version `here <http://example.com>`_ and include it in your project.  

.. code-block:: html

  <script type="text/javascript" src="aq-miniapp-core-min.js"></script>

Now that you have installed the required dependencies, head over to the Integration Guide.  

