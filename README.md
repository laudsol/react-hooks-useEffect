# The useEffect Hook

## Why `useEffect`?

When React introduced the core Hooks like `useState`, `useEffect`, and others in 2018, many developers found the name of one particular hook confusing: `useEffect`.

**What does "effect" mean?**

The term "effect" refers to a concept in functional programming known as a "side effect."

Before we can understand what a side effect is, let's grasp the concept of a pure function.
![pure functions](https://res.cloudinary.com/practicaldev/image/fetch/s--rVaJWUod--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n3ab0kd7kb9br8365op1.png)

Did you know that most React components are actually pure functions?

It might sound strange to think of React components as functions, but they are.

To understand this better, let's take a look at a regular React function component defined in JavaScript:

```javascript
function MyReactComponent() {}
```

Most React components are pure functions, which means they take an input and produce a predictable output in the form of JSX.

In JavaScript functions, the input is provided through arguments. But what about React components? Well, they use something called "props" as their input!

Here's an example of a `User` component with a `name` prop declared on it. Inside the `User` component, the value of the prop is displayed within a header element.

```javascript
export default function App() {
  return <User name="Alex" />   
}
  
function User(props) {
  return <h1>{props.name}</h1>; // John Doe
}
```

This component is pure because it always produces the same output when given the same input.

If we pass the `User` component a `name` prop with the value "John Doe," the output will always be "John Doe."

Now you might be wondering, "So what's the big deal? Why does this need a specific name?"

Well, pure functions have some great benefits: they are predictable, reliable, and easy to test.

But things get a bit different when we need to perform a side effect in our component.

**What are side effects in React?**

Side effects are actions that interact with the "outside world" and are not predictable.

We perform side effects when we need to reach beyond our React components and do something external. However, performing a side effect does not guarantee a predictable result.

Let's say we want to request data (like blog posts) from a server. If the server fails and instead of returning the expected post data, it responds with a 500 status code, that's an example of an unpredictable side effect.

Almost all applications rely on side effects in one way or another, except for the simplest ones.

Some common side effects include:

- Making API requests to fetch data from a backend server.
- Interacting with browser APIs (e.g., using `document` or `window` directly).
- Using timing functions like `setTimeout` or `setInterval`, which have unpredictable behavior.

  ![side effects](https://alexsidorenko.com/static/3af4fc361c972facf838dcb10eb0e851/f058b/side-effect-3.png)

This is where `useEffect` comes into play. Its purpose is to handle the execution of these side effects within otherwise pure React components.

For example, let's say we want to change the `<title>` meta tag to display the user's name in their browser tab. We could do it directly within the component, but that's not recommended.

```javascript
function User({ name }) {
  document.title = name; 
  // This is a side effect. Don't do this in the component body!
    
  return <h1>{name}</h1>;   
}
```

Performing a side effect directly within the component body interferes with the rendering process of our React component.

Side effects should be separate from the rendering process. If we need to perform a side effect, it should be done strictly after our component has rendered.

And that's precisely what `useEffect` enables us to do.

In short, `

useEffect` is a tool that allows us to interact with the outside world without affecting the rendering or performance of the component it's used in.

## How do I use `useEffect`?

The basic syntax of `useEffect` is as follows:

```javascript
// 1. Import useEffect
import { useEffect } from 'react';

function MyComponent() {
  // 2. Call it above the returned JSX
  // 3. Pass two arguments to it: a function and an array
  useEffect(() => {}, []);
  
  // ...rest of the component
}
```

Now let's correct the way we perform the side effect in our `User` component:

1. Import `useEffect` from `"react"`.
2. Call `useEffect` above the returned JSX in our component.
3. Pass two arguments to `useEffect`: a function and an array.

```javascript
import { useEffect } from 'react';

function User({ name }) {
  useEffect(() => {
    document.title = name;
  }, [name]);
    
  return <h1>{name}</h1>;   
}
```

The function passed to `useEffect` is a callback function that will be called after the component has rendered.

Within this function, we can perform our side effects or multiple side effects if needed.

The second argument is an array, often called the "dependencies" array. It should include all the values that our side effect relies on.

In our example above, since we're changing the title based on a value from the outer scope (`name`), we need to include it in the dependencies array.

This array serves a purpose: it checks if a value (in this case, `name`) has changed between renders. If it has, the `useEffect` function will be executed again.

This makes sense because if the `name` changes, we want to display the updated name and re-run our side effect.

## How to avoid common mistakes with `useEffect`

To avoid mistakes with `useEffect`, there are some subtle details to be aware of:

1. If you don't provide the dependencies array at all and only provide a function to `useEffect`, it will run after every render.

   This can lead to problems when you're trying to update state within your `useEffect` hook.

3. If you forget to provide the dependencies correctly and you're setting a piece of local state when the state updates, React's default behavior is to re-render the component. This means that, without the dependencies array, `useEffect` will run after every render, causing an infinite loop.

   ```javascript
   function MyComponent() {
     const [joke, setJoke] = useState([]);
       
     useEffect(() => {
       fetch(https://api.chucknorris.io/jokes/random).then(myJoke => setJoke(myJoke.value));
       // Error! `useEffect` runs after every render without the dependencies array, causing an infinite loop
     }); 
   }
   ```

      ![infinite loop](https://dmitripavlutin.com/static/7d3875baafc5e00f3bf71fe1b55ac5a5/3e7da/1.png)


   After the first render, `useEffect` will be run, updating the state, which triggers a re-render, causing `useEffect` to run again, and the cycle repeats indefinitely.

   This is called an infinite loop and effectively breaks our application.

   If you're updating state within `useEffect`, make sure to provide an empty dependencies array. By default, it's recommended to use an empty array whenever you use `useEffect`. This will cause the effect function to run only once after the component has rendered for the first time.

   A common example is fetching data. You might want to fetch data only once, store it in state, and display it in your JSX.

   ```javascript
   function MyComponent() {
     const [joke, setJoke] = useState([]);
       
     useEffect(() => {
       fetch(https://api.chucknorris.io/jokes/random).

then(myJoke => setJoke(myJoke.value));
       // Correct! Runs once after render with empty array
     }, []); 
     
     return <p>{joke}</p>;
   }
   ```

## What is the cleanup function in `useEffect`?

The final part of properly handling side effects in React is the effect cleanup function.

Sometimes, we need to clean up our side effects. For example, if you have a countdown timer using the `setInterval` function, that interval will keep running unless we use the `clearInterval` function to stop it.

Another example is using an event listener. Event listeners need to be "turned off" when we no longer need them, and that's where the cleanup function comes in.

If we're setting state using `setInterval` and the side effect isn't cleaned up, when our component unmounts, the state is destroyed with the component, but the `setInterval` function will keep running.

```javascript
function Timer() {
  const [time, setTime] = useState(0);
    
  useEffect(() => {
    setInterval(() => setTime(1), 1000); 
    // Counts up 1 every second
    // We need to stop using setInterval when the component unmounts
  }, []);
}
```

The problem here is that when the component is unmounting, `setInterval` will try to update a state variable (`time`) that no longer exists. This is an error called a memory leak.

To observe the behavior where the interval continues running even after the component is unmounted, Let's take a look at [cleanUpFuntion.js](./examples/cleanUpFuntion.js)

To use the cleanup function, we need to return a function from within the `useEffect` function.

Inside this function, we can perform our cleanup, such as using `clearInterval` to stop the `setInterval`.

```javascript
function Timer() {
  const [time, setTime] = useState(0);
    
  useEffect(() => {
    let interval = setInterval(() => setTime(1), 1000); 

    return () => {
      // `setInterval` cleared when the component unmounts
      clearInterval(interval);
    }
  }, []);
}
```

The cleanup function will be called when the component is unmounted.

A common scenario where a component is unmounted is when we navigate to a new page or a new route in our application where the component is no longer rendered.

When a component is unmounted, our cleanup function runs, the interval is cleared, and we no longer get an error when attempting to update a state variable that doesn't exist.

Finally, the side effect cleanup is not required in every case. It's only necessary in a few cases, such as when you need to stop a repeated side effect when your component unmounts.






