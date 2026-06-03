import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.borrowRecord.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.librarySettings.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.user.deleteMany();

  // ─── Library Settings ─────────────────────────────────────────
  const settings = await prisma.librarySettings.create({
    data: {
      isOpen: true,
      closingTime: "21:00",
      openingTime: "07:00",
      maxBorrowStudent: 3,
      maxBorrowFaculty: 10,
      maxBorrowVisitor: 1,
      borrowDaysStudent: 14,
      borrowDaysFaculty: 30,
      borrowDaysVisitor: 7,
      qrValidityMinutes: 15,
    },
  });
  console.log("✅ Library settings created");

  // ─── Users ─────────────────────────────────────────────────────
  const student = await prisma.user.create({
    data: {
      fullName: "Juan Dela Cruz",
      email: "juan@university.edu",
      password: hashPassword("password123"),
      universityId: "CS-2024-0001",
      role: "student",
      program: "Computer Science",
      yearLevel: "3rd Year",
      avatarInitials: "JD",
      streakCount: 5,
      streakLastDate: new Date().toISOString().split("T")[0],
      isOnboarded: true,
      notificationDueDate: true,
      notificationReservation: true,
      notificationAnnouncements: false,
    },
  });

  const faculty = await prisma.user.create({
    data: {
      fullName: "Maria Santos",
      email: "maria@university.edu",
      password: hashPassword("password123"),
      universityId: "FAC-2024-0001",
      role: "faculty",
      department: "Computer Science",
      avatarInitials: "MS",
      streakCount: 12,
      streakLastDate: new Date().toISOString().split("T")[0],
      isOnboarded: true,
      notificationDueDate: true,
      notificationReservation: true,
      notificationAnnouncements: true,
    },
  });

  const visitor = await prisma.user.create({
    data: {
      fullName: "Alex Reyes",
      email: "alex@university.edu",
      password: hashPassword("password123"),
      universityId: "VIS-2024-0001",
      role: "visitor",
      avatarInitials: "AR",
      isOnboarded: true,
      notificationDueDate: true,
      notificationReservation: false,
      notificationAnnouncements: false,
    },
  });
  console.log("✅ Users created (3)");

  // ─── Resources ─────────────────────────────────────────────────
  const resourcesData = [
    // Books (10)
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen, Charles E. Leiserson",
      isbn: "978-0262033848",
      category: "book",
      copies: 5,
      availableCopies: 3,
      shelfLocation: "CS-A1",
      abstract:
        "A comprehensive textbook covering a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.",
      publicationDate: "2009",
      coverImage: "/covers/introduction-to-algorithms.png",
      subject: "Computer Science",
      tags: "algorithms,data structures,complexity",
      status: "available",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "book",
      copies: 3,
      availableCopies: 2,
      shelfLocation: "SE-B2",
      abstract:
        "A handbook of agile software craftsmanship that will instill within you the values of a software craftsman and make you a better programmer.",
      publicationDate: "2008",
      coverImage: "/covers/clean-code.png",
      subject: "Software Engineering",
      tags: "clean code,software craftsmanship,agile",
      status: "available",
    },
    {
      title: "Design Patterns",
      author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      isbn: "978-0201633610",
      category: "book",
      copies: 4,
      availableCopies: 4,
      shelfLocation: "SE-B3",
      abstract:
        "Elements of Reusable Object-Oriented Software. Captures a wealth of experience about the design of object-oriented software.",
      publicationDate: "1994",
      coverImage: "/covers/design-patterns.png",
      subject: "Software Engineering",
      tags: "design patterns,oop,architecture",
      status: "available",
    },
    {
      title: "Deep Learning",
      author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
      isbn: "978-0262035613",
      category: "book",
      copies: 3,
      availableCopies: 2,
      shelfLocation: "AI-C1",
      abstract:
        "An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background, deep learning techniques, and research perspectives.",
      publicationDate: "2016",
      coverImage: "/covers/deep-learning.png",
      subject: "Artificial Intelligence",
      tags: "deep learning,neural networks,machine learning",
      status: "available",
    },
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas, Andrew Hunt",
      isbn: "978-0135957059",
      category: "book",
      copies: 3,
      availableCopies: 3,
      shelfLocation: "SE-B4",
      abstract:
        "Your journey to mastery. Examines the core process of software development with insights and practical advice for becoming a more effective programmer.",
      publicationDate: "2019",
      coverImage: "/covers/the-pragmatic-programmer.png",
      subject: "Software Engineering",
      tags: "programming,software development,best practices",
      status: "available",
    },
    {
      title: "Database System Concepts",
      author: "Avi Silberschatz, Henry Korth, S. Sudarshan",
      isbn: "978-0078022159",
      category: "book",
      copies: 4,
      availableCopies: 3,
      shelfLocation: "DB-D1",
      abstract:
        "Presents the fundamental concepts of database management, covering relational model, SQL, database design, and transaction management.",
      publicationDate: "2019",
      subject: "Database Systems",
      tags: "database,SQL,relational model,transactions",
      status: "available",
    },
    {
      title: "Operating System Concepts",
      author: "Abraham Silberschatz, Peter Baer Galvin, Greg Gagne",
      isbn: "978-1119800361",
      category: "book",
      copies: 4,
      availableCopies: 4,
      shelfLocation: "OS-D2",
      abstract:
        "The ninth edition of this best-selling text provides a solid theoretical foundation for understanding operating systems.",
      publicationDate: "2018",
      subject: "Operating Systems",
      tags: "operating systems,processes,memory management",
      status: "available",
    },
    {
      title: "Computer Networks",
      author: "Andrew S. Tanenbaum, David J. Wetherall",
      isbn: "978-0132126953",
      category: "book",
      copies: 3,
      availableCopies: 2,
      shelfLocation: "NW-E1",
      abstract:
        "A comprehensive introduction to computer networks, covering the physical layer up through the application layer.",
      publicationDate: "2011",
      subject: "Computer Networks",
      tags: "networking,TCP/IP,protocols",
      status: "available",
    },
    {
      title: "Artificial Intelligence: A Modern Approach",
      author: "Stuart Russell, Peter Norvig",
      isbn: "978-0134610993",
      category: "book",
      copies: 3,
      availableCopies: 1,
      shelfLocation: "AI-C2",
      abstract:
        "The most comprehensive and authoritative AI textbook available, covering the latest developments in the field.",
      publicationDate: "2020",
      coverImage: "/covers/ai-modern-approach.png",
      subject: "Artificial Intelligence",
      tags: "AI,machine learning,search,reasoning",
      status: "available",
    },
    {
      title: "Computer Architecture",
      author: "John L. Hennessy, David A. Patterson",
      isbn: "978-0128119051",
      category: "book",
      copies: 2,
      availableCopies: 2,
      shelfLocation: "ARCH-F1",
      abstract:
        "A quantitative approach to computer architecture that explores the ways software and hardware interact in system design.",
      publicationDate: "2017",
      subject: "Computer Architecture",
      tags: "architecture,performance,pipeline",
      status: "available",
    },
    // Research (4)
    {
      title: "Machine Learning: A Probabilistic Perspective",
      author: "Kevin P. Murphy",
      isbn: "978-0262018029",
      category: "research",
      copies: 2,
      availableCopies: 1,
      shelfLocation: "ML-R1",
      abstract:
        "A comprehensive introduction to machine learning that uses a probabilistic framework to unify the field.",
      publicationDate: "2012",
      subject: "Machine Learning",
      tags: "machine learning,probabilistic,Bayesian",
      status: "available",
    },
    {
      title: "Journal of Computer Science Vol. 42",
      author: "Various Authors",
      issn: "1554-8937",
      category: "research",
      copies: 1,
      availableCopies: 1,
      shelfLocation: "JCS-R2",
      abstract:
        "Latest research articles in computer science covering algorithms, systems, and applications.",
      publicationDate: "2025",
      subject: "Computer Science",
      tags: "journal,research,computer science",
      status: "available",
    },
    {
      title: "Proceedings of NeurIPS 2025",
      author: "NeurIPS Conference",
      category: "research",
      copies: 2,
      availableCopies: 2,
      shelfLocation: "NIPS-R3",
      abstract:
        "Conference proceedings from the 2025 Neural Information Processing Systems conference.",
      publicationDate: "2025",
      subject: "Neural Networks",
      tags: "NeurIPS,neural networks,deep learning",
      status: "available",
    },
    {
      title: "ACM Computing Surveys",
      author: "Association for Computing Machinery",
      issn: "0360-0300",
      category: "research",
      copies: 1,
      availableCopies: 0,
      shelfLocation: "ACM-R4",
      abstract:
        "In-depth survey articles on topics across all areas of computer science.",
      publicationDate: "2025",
      subject: "Computer Science",
      tags: "survey,computing,ACM",
      status: "borrowed",
    },
    // Magazines (3)
    {
      title: "National Geographic March 2026",
      author: "National Geographic Society",
      issn: "0027-9358",
      category: "magazine",
      copies: 2,
      availableCopies: 2,
      shelfLocation: "MAG-G1",
      abstract:
        "Exploring the world through science, storytelling, and photography.",
      publicationDate: "2026-03",
      subject: "General Science",
      tags: "geography,science,photography",
      status: "available",
    },
    {
      title: "Time Magazine Spring 2026",
      author: "Time USA, LLC",
      issn: "0040-781X",
      category: "magazine",
      copies: 2,
      availableCopies: 1,
      shelfLocation: "MAG-G2",
      abstract: "Breaking news and analysis from around the world.",
      publicationDate: "2026-03",
      subject: "Current Events",
      tags: "news,politics,current events",
      status: "available",
    },
    {
      title: "Scientific American April 2026",
      author: "Springer Nature",
      issn: "0036-8733",
      category: "magazine",
      copies: 2,
      availableCopies: 2,
      shelfLocation: "MAG-G3",
      abstract:
        "Authoritative coverage of science and technology developments.",
      publicationDate: "2026-04",
      subject: "Science",
      tags: "science,technology,research",
      status: "available",
    },
  ];

  const resources = [];
  for (const data of resourcesData) {
    const resource = await prisma.resource.create({ data });
    resources.push(resource);
  }
  console.log(`✅ Resources created (${resources.length})`);

  // ─── Borrow Records ────────────────────────────────────────────
  const now = new Date();

  // Active borrows for student
  const borrow1 = await prisma.borrowRecord.create({
    data: {
      userId: student.id,
      resourceId: resources[0].id, // Introduction to Algorithms
      borrowDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      dueDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
      status: "active",
      isLate: false,
    },
  });

  const borrow2 = await prisma.borrowRecord.create({
    data: {
      userId: student.id,
      resourceId: resources[8].id, // AI: A Modern Approach
      borrowDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      status: "active",
      isLate: false,
    },
  });

  // Overdue borrow for student
  const borrow3 = await prisma.borrowRecord.create({
    data: {
      userId: student.id,
      resourceId: resources[3].id, // Deep Learning
      borrowDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      dueDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago (overdue!)
      status: "overdue",
      isLate: true,
    },
  });

  // Returned borrows
  await prisma.borrowRecord.create({
    data: {
      userId: faculty.id,
      resourceId: resources[13].id, // ACM Computing Surveys
      borrowDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      dueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Was due 15 days ago
      returnDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Returned 10 days ago
      status: "returned",
      isLate: true,
    },
  });

  await prisma.borrowRecord.create({
    data: {
      userId: student.id,
      resourceId: resources[4].id, // The Pragmatic Programmer
      borrowDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      dueDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // Was due 6 days ago
      returnDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // Returned 8 days ago (on time)
      status: "returned",
      isLate: false,
    },
  });
  console.log("✅ Borrow records created (5)");

  // ─── Notifications ──────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        type: "due_date",
        title: "Book Due Soon",
        message:
          "Deep Learning is due in 0 days. Please return it on time to avoid late fees.",
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        userId: student.id,
        type: "due_date",
        title: "Overdue Notice",
        message:
          "Deep Learning is now overdue. Please return it immediately to avoid penalties.",
        isRead: false,
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        userId: student.id,
        type: "reservation",
        title: "Reservation Ready",
        message:
          'Your reserved book "Clean Code" is now available for pickup at the circulation desk.',
        isRead: false,
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        userId: student.id,
        type: "announcement",
        title: "Library Hours Update",
        message:
          "The library will extend operating hours during finals week. Check the announcement for details.",
        isRead: true,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: faculty.id,
        type: "reservation",
        title: "Reservation Confirmed",
        message: 'Your reservation for "Design Patterns" has been confirmed.',
        isRead: false,
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        userId: faculty.id,
        type: "due_date",
        title: "Return Reminder",
        message:
          'Your borrowed book "ACM Computing Surveys" was returned late. A late fee may apply.',
        isRead: true,
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
    ],
  });
  console.log("✅ Notifications created (6)");

  // ─── Announcements ──────────────────────────────────────────────
  await prisma.announcement.createMany({
    data: [
      {
        title: "Extended Library Hours for Finals Week",
        message:
          "Starting March 25, the library will be open from 6:00 AM to 11:00 PM to support students during finals week. Regular hours will resume on April 5. Good luck with your exams!",
        targetRoles: "all",
        isActive: true,
      },
      {
        title: "New Arrivals: AI & Machine Learning Collection",
        message:
          'We\'ve added 15 new titles to our AI and Machine Learning collection, including the latest editions of "Deep Learning" and "AI: A Modern Approach". Visit the AI section (Shelf AI-C) to check them out!',
        targetRoles: "all",
        isActive: true,
      },
    ],
  });
  console.log("✅ Announcements created (2)");

  // ─── Sample Reservation ─────────────────────────────────────────
  await prisma.reservation.create({
    data: {
      userId: student.id,
      resourceId: resources[1].id, // Clean Code
      status: "pending",
    },
  });
  console.log("✅ Sample reservation created");

  // ─── Sample Attendance ──────────────────────────────────────────
  const today = now.toISOString().split("T")[0];
  await prisma.attendance.create({
    data: {
      userId: student.id,
      date: today,
      timeIn: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      timeOut: null,
    },
  });

  // Previous attendance
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  await prisma.attendance.create({
    data: {
      userId: student.id,
      date: yesterday,
      timeIn: new Date(now.getTime() - 27 * 60 * 60 * 1000),
      timeOut: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      duration: 420, // 7 hours
    },
  });
  console.log("✅ Sample attendance records created");

  // ─── Reviews ───────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      {
        userId: student.id,
        resourceId: resources[0].id, // Introduction to Algorithms
        rating: 5,
        comment:
          "Excellent textbook for algorithms! Clear explanations and comprehensive coverage of every topic.",
      },
      {
        userId: faculty.id,
        resourceId: resources[0].id, // Introduction to Algorithms
        rating: 5,
        comment:
          "The gold standard for algorithm textbooks. I use this in every course I teach.",
      },
      {
        userId: visitor.id,
        resourceId: resources[0].id, // Introduction to Algorithms
        rating: 4,
        comment: "Very thorough but can be dense. Great as a reference book.",
      },
      {
        userId: student.id,
        resourceId: resources[3].id, // Deep Learning
        rating: 5,
        comment:
          "Great for deep learning fundamentals. The math sections are rigorous yet accessible.",
      },
      {
        userId: faculty.id,
        resourceId: resources[3].id, // Deep Learning
        rating: 4,
        comment:
          "A solid foundation for understanding neural networks. Some chapters feel outdated now.",
      },
      {
        userId: student.id,
        resourceId: resources[1].id, // Clean Code
        rating: 4,
        comment:
          "Changed the way I write code. Practical advice every developer should follow.",
      },
      {
        userId: student.id,
        resourceId: resources[8].id, // AI: A Modern Approach
        rating: 5,
        comment:
          "The most comprehensive AI textbook available. Covers everything from search to deep learning.",
      },
      {
        userId: faculty.id,
        resourceId: resources[4].id, // The Pragmatic Programmer
        rating: 5,
        comment:
          "Timeless wisdom for programmers. I recommend this to all my students.",
      },
      {
        userId: visitor.id,
        resourceId: resources[4].id, // The Pragmatic Programmer
        rating: 3,
        comment:
          "Good insights but some advice feels obvious if you have industry experience.",
      },
      {
        userId: student.id,
        resourceId: resources[5].id, // Database System Concepts
        rating: 2,
        comment:
          "Dense and hard to follow in some chapters. Better alternatives exist for self-study.",
      },
    ],
  });
  console.log("✅ Reviews created (10)");

  console.log("\n🎉 Seeding complete!");
  console.log(`\n📋 Test Accounts:`);
  console.log(`   Student:  juan@university.edu / password123`);
  console.log(`   Faculty:  maria@university.edu / password123`);
  console.log(`   Visitor:  alex@university.edu / password123`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
