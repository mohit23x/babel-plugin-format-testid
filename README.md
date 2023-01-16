## Babel Plugin to format testIDs

A babel plugin to format testIDs in React Native app for running Appium E2E tests.

#### INPUT:
```
    <Button testID={variable} />
    <Button testID={"asdf"+2} />
    <Button testID="asdf" />
```

#### OUTPUT:
```
    <Button testID={"prefix" + variable} />
    <Button testID={"prefix" + ("asdf" + 2)} />
    <Button testID={"prefix" + "asdf"} />
```


To setup E2E tests with Appium for the React Native app, we need to format the testIds of components with bundleID as prefix, and to keep the code simple and readable, something like

```
<Button
    testId="checkout-button"
/>
``` 

and not

```
<Button
    testId="com.example.yourapp:id/checkout-button"
/>
``` 
we made this babel plugin which will format the testIds at compile time.



### Setup

Step 1: Install the package

```
    yarn add -D babel-plugin-format-testid
```

Step 2: Configure plugin babelrc or babel.config.js file

```
module.exports = {
  presets: [ //... ],
  plugins: [
    [
      'format-testid',
      {
        prefix: 'com.razorpay.payments.app:id/',
        skip: process.env.JEST_WORKER_ID,
      },
    ],
  ],
};

```


- prefix (string): This paramter holds the value whihc will be prefixed before every testId

- skip (boolean): This parameter tells whether the plugin should format the testID or not, for example setting the value `process.env.JEST_WORKER_ID` means do not format the values when Jest unit tests are running.


