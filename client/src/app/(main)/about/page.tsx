/* eslint-disable react/no-unescaped-entities */
const About = () => {
  const benefit = [
    {
      label: "Students:",
      description:
        "Organize lecture notes, assignments, and research papers efficiently.",
    },

    {
      label: "Professionals:",
      description:
        "Collaborate with team members, clients, and partners on projects and proposals.",
    },

    {
      label: "Researchers:",
      description:
        "Manage research documents, collect feedback, and track revisions seamlessly.",
    },

    {
      label: "Academic Institutions:",
      description:
        "Facilitate document sharing and collaboration among faculty members, students, and administrative staff.",
    },
  ];
  return (
    <main className="px-20">
      <h2 className="font-[700] text-[24px] mb-8">About BUHREC:</h2>
      <p className="mb-12">
        Welcome to BUHREC – your comprehensive platform for document management
        and collaboration. At BUHREC, we understand the importance of efficient
        document handling, whether you're a student, researcher, professional,
        or academic institution.
      </p>

      <h2 className="font-[700] text-[24px] mb-8">Who can benefit:</h2>

      <div className="mb-12">
        {benefit.map((benefit, index) => (
          <div className="flex gap-x-3 items-center mb-4" key={index}>
            <div className="rounded-full bg-black h-[10px] w-[10px]" />
            <p>
              <span className="font-[600]">{benefit.label}</span>{" "}
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-[700] text-[24px] mb-8">Get Started with BUHREC:</h2>
      <p className="mb-12">
        Join the thousands of users who trust BUHREC for their document
        management needs. Sign up today and experience the convenience of
        streamlined document handling and collaboration.
      </p>

      <p className="mb-12 font-[700]">
        Experience the Future of Document Management with BUHREC – Where
        Efficiency Meets Innovation!
      </p>
    </main>
  );
};

export default About;
