import Hero from './components/blocks/Hero';

const App = () => {
  return (
    <div>
      <main>
        <article className="h-[calc(80vh-44px)]">
          <Hero />
        </article>
      </main>
    </div>
  );
};

export default App;
