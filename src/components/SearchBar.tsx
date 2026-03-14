type SearchBarProps = {
  defaultValue?: string;
};

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  return (
    <form className="search-bar" action="/registry">
      <input
        aria-label="Search skills"
        defaultValue={defaultValue}
        name="q"
        placeholder="Search by skill, author, dependency, or description"
        type="search"
      />
      <button type="submit">Search</button>
    </form>
  );
}
