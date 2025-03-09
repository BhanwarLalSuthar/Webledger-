

const About = () => {
  // const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-gray-100 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold">About Us</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mt-4 text-gray-600">
          Our journey in bringing simple, authentic recipes to your home.
        </p>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            In March 2025, we started our culinary journey with a simple vision: to make cooking enjoyable and accessible to everyone.
          </p>
        </div>
        <img
          src="https://img.freepik.com/premium-photo/international-team-chefs_917664-54146.jpg"
          alt="Our kitchen team"
          className="md:w-1/2 rounded-lg shadow-sm"
        />
      </section>

      {/* Meet the Team */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-semibold mb-6">Our Culinary Experts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Chef Maria", role: "Executive Chef", desc: "Mediterranean Cuisine Expert.", img: "https://previews.123rf.com/images/serezniy/serezniy1301/serezniy130105717/21537587-young-woman-chef-cooking-in-kitchen.jpg" },
            { name: "Chef James", role: "Pastry Specialist", desc: "Innovative dessert artist.", img: "https://media.istockphoto.com/id/921788748/photo/portrait-of-confectioner-decorating-cake-in-restaurant-kitchen.jpg" },
            { name: "Chef Priya", role: "Fusion Cuisine Expert", desc: "Blending global flavors.", img: "https://st2.depositphotos.com/1177973/11053/i/450/depositphotos_110537550-stock-photo-young-woman-cooking-in-kitchen.jpg" }
          ].map(({ name, role, desc, img }) => (
            <div key={name} className="bg-white rounded-lg shadow-sm p-6">
              <img src={img} alt={name} className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-gray-500 text-sm">{role}</p>
              <p className="text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-900 text-white py-12 text-center">
        <h2 className="text-3xl font-semibold mb-6">Join Our Community</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto text-gray-300">
          Have a recipe to share? We'd love to hear from you!
        </p>
        <button className="bg-white text-gray-900 px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default About;
