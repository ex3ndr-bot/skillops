import Link from "next/link";

import { SearchBar } from "@/components/SearchBar";
import { SkillCard } from "@/components/SkillCard";
import { sampleSkills, skillCategories } from "@/lib/data";
import { SkillCategory } from "@/lib/types";

type RegistryPageProps = {
  searchParams?: {
    q?: string;
    category?: SkillCategory | "all";
  };
};

export default function RegistryPage({ searchParams }: RegistryPageProps) {
  const query = searchParams?.q?.toLowerCase() ?? "";
  const activeCategory = searchParams?.category ?? "all";

  const filteredSkills = sampleSkills.filter((skill) => {
    const matchesCategory = activeCategory === "all" || skill.category === activeCategory;
    const matchesSearch =
      query.length === 0 ||
      [skill.name, skill.author, skill.description, skill.dependencies.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Skill registry</p>
            <h2>Browse approved and in-flight AI skills</h2>
          </div>
        </div>
        <SearchBar defaultValue={searchParams?.q} />
        <div className="filter-row">
          {skillCategories.map((category) => (
            <Link
              className={`filter-pill ${activeCategory === category ? "filter-pill-active" : ""}`}
              href={
                category === "all"
                  ? `/registry${searchParams?.q ? `?q=${encodeURIComponent(searchParams.q)}` : ""}`
                  : `/registry?category=${category}${searchParams?.q ? `&q=${encodeURIComponent(searchParams.q)}` : ""}`
              }
              key={category}
            >
              <span className="capitalize">{category === "all" ? "All categories" : category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="card-grid">
        {filteredSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </section>
    </div>
  );
}
