Getting Started
==================

This document will show you how to get up and running with *AQ MiniApp Core Javascript Library*.

Prerequisites
-------------------------

You need to have at least a basic understanding of the following technologies:

1. Javascript (particularly `ES6 <https://babeljs.io/learn-es2015/>`_)
2. `NodeJS <https://nodejs.org/en/>`_ (particularly NPM) 
3. `PixiJS <http://www.pixijs.com/>`_

Make sure the following are installed in your system. Please refer to each site's installation steps as they are not part of this document.

* **Node** - https://nodejs.org/en/

Optionally, (but recommended):

* **Yarn** - https://yarnpkg.com/en/


Get the Boilerplate Code
-------------------------

We have already created a starter code template where all the details of connecting the the AQ App Environment has already been setup so you can focus on developing the details of your mini app. 

.. code-block:: bash

  $ git clone https://bitbucket.org/aqsoftware/aq-miniapp-base-pixi.git my-first-miniapp


Get the project dependencies, and run the project
--------------------------------------------------

.. code-block:: bash

  $ npm install && npm run start

or if using *Yarn*::

  $ yarn && yarn start

Once the dependencies are pulled and the built-in web-server started, your browser will be opened to http://localhost:3000 and reveal a rotating bunny.

AQ miniapps are HTML5 Canvas apps. Though there are lots of frameworks that make use of this, we will focus on `PixiJS <http://www.pixijs.com/>`_ for this particular tutorial.


Add calls to the MiniApp Lifecyle methods
--------------------------------------------------

Open ``src/Sample.js`` and add a reference on top of the file to the ``aq-miniapp-core`` classes that we will use for this tutorial.

.. code-block:: javascript

  // @flow
  import Game from './components/Game';
  import Assets, { ASSETS } from './assets';
  
  // Add a reference to aq-miniapp-core
  import { defaultLifeCycle, Utils } from 'aq-miniapp-core';

Since your app will be running under the AQ App environment, there are several things we need to tell the host app with regards to our mini app, but we will just focus with the following three items at the moment: 

1. What background image the host app will use 
2. When your mini app is ready to display
3. When your mini app has ended

Tell the host app what background image should it use
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The best place to do this is in the ``gameDidMount()`` method. This function is called when your mini app code has been loaded. Your ``gameDidMount()`` should now look like this:

.. code-block:: javascript

  gameDidMount() {
    // Inform the host app what background to use
    defaultLifeCycle.setAppData({ backgroundImage: `${Utils.relativeToAbsolutePath(Assets.images.background)}` });

    // Add additional assets to load which are passed through this.props.additionalInfo
    const thingsToLoad = ASSETS.concat([
      this.props.additionalInfo.background
    ]);
    this.loadAssets(thingsToLoad);
  }

The call to ``Utils.relativeToAbsolutePath`` just converts a resource bundled in the app to its absolute URL. In general, you can pass any valid JPG image URL to the call to ``defaultLifeCycle.setAppData()``.


Inform the host app that your mini app is ready
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``gameDidMount()`` is a good place to do some setup code for you app, like loading assets, etc. For this example, the PixiJS loader is set to call ``gameDidLoad()`` once all the assets has been loaded. This is also a good place to inform the host app that your mini app is ready to be displayed.

.. code-block:: javascript

  gameDidLoad(loader: any, resources: any) {
    const bg = new PIXI.Sprite(resources[this.props.additionalInfo.background].texture)
    const bunny = new PIXI.Sprite(resources[Assets.images.bunny].texture);
      .
      .
      .
    // Inform the host app that we are ready to be displayed
    defaultLifeCycle.informReady();
  }

Inform the host app that your mini app has ended
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

For now, let's tell the host app that our mini app ends when we click the **Done** button. We do this by inserting the following code in `onButtonUp()` method.


.. code-block:: javascript

  onButtonUp() {
    this.button.texture = this.buttonUpTexture;

    // Inform the host app that our mini app has ended 
    defaultLifeCycle.end();
  }


Run your mini app in the simulator
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Open your browser (preferably `Google Chrome <https://www.google.com/chrome/>`_ and open the URL: http://fma-sdk.s3-website-ap-southeast-1.amazonaws.com/simulator/index.html to launch the AQ MiniApp web simulator. At this point, the simulator is just an approximation of how your mini app will look like on an actual device.

To use the Simulator, enter your mini app URL (usually http://localhost:3000 during development) and press Go. 

If you correctly followed the steps above, you should see the various AQ MiniApp events printed on the console. Don't worry if there are duplicates (especially on the `setAppData` and `informReady` events) as these are expected. If you press **Done**, you should see the `end` event printed on the console.

Congrats! You now have a minimal working AQ mini app ready for submission! :)

Your final `SampleGame.js` should look something like this:

.. code-block:: javascript

  // @flow
  import Game from './components/Game';
  import Assets, { ASSETS } from './assets';

  // Add a reference to aq-miniapp-core
  import { defaultLifeCycle, Utils } from 'aq-miniapp-core';

  const PIXI = window.PIXI;

  type Props = {
    additionalInfo: {
      background: string
    }
  }

  export default class SampleGame extends Game<Props> {

    button: PIXI.Sprite;
    buttonUpTexture: any;
    buttonDownTexture: any;

    gameDidMount() {
      // Inform the host app what background to use
      defaultLifeCycle.setAppData({ backgroundImage: `${Utils.relativeToAbsolutePath(Assets.images.background)}` });

      // Add additional assets to load which are passed through this.props.additionalInfo
      const thingsToLoad = ASSETS.concat([
        this.props.additionalInfo.background
      ]);
      this.loadAssets(thingsToLoad);
    }

    gameDidLoad(loader: any, resources: any) {
      const bg = new PIXI.Sprite(resources[this.props.additionalInfo.background].texture)
      const bunny = new PIXI.Sprite(resources[Assets.images.bunny].texture);

      // Setup background
      bg.x = 0;
      bg.y = 0;
      bg.width = this.app.renderer.width;
      bg.height = this.app.renderer.height;
      this.app.stage.addChild(bg);

      // Setup the size and position of the bunny
      bunny.width = 300;
      bunny.height = 300;
      bunny.x = this.app.renderer.width / 2;
      bunny.y = this.app.renderer.height / 2;

      // Rotate around the center
      bunny.anchor.x = 0.5;
      bunny.anchor.y = 0.5;

      // Add the bunny to the scene we are building
      this.app.stage.addChild(bunny);

      // Setup and add the button
      this.buttonUpTexture = resources[Assets.textures.button].textures[0];
      this.buttonDownTexture = resources[Assets.textures.button].textures[1];

      this.button = new PIXI.Sprite(this.buttonUpTexture);
      this.button.width = 230;
      this.button.height = 70;
      this.button.x = (this.app.renderer.width - this.button.width) / 2;
      this.button.y = this.app.renderer.height - 100;
      this.button.interactive = true;
      this.button.buttonMode = true;
      this.button
        // Mouse & touch events are normalized into
        // the pointer* events for handling different
        // button events.
        .on('pointerdown', this.onButtonDown.bind(this))
        .on('pointerup', this.onButtonUp.bind(this))
        .on('pointerupoutside', this.onButtonUp.bind(this))

      this.app.stage.addChild(this.button);

      // Listen for frame updates
      this.app.ticker.add(() => {
        // each frame we spin the bunny around a bit
        bunny.rotation += 0.01;
      });

      defaultLifeCycle.informReady();
    }

    onButtonDown() {
      this.button.texture = this.buttonDownTexture;

      // Inform the host app that our mini app has ended
      defaultLifeCycle.end();
    }

    onButtonUp() {
      this.button.texture = this.buttonUpTexture;
    }
  }








