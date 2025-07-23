// Datos de películas y series para el clon de Netflix
const movieData = {
    trending: [
        {
            id: 1,
            title: "Spider-Man: No Way Home",
            type: "movie",
            year: 2021,
            rating: 8.2,
            duration: "148 min",
            genre: ["Acción", "Aventura", "Sci-Fi"],
            description: "Con la identidad de Spider-Man revelada, Peter pide ayuda al Doctor Strange. Cuando un hechizo sale mal, peligrosos enemigos de otros mundos comienzan a aparecer.",
            image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            featured: true
        },
        {
            id: 2,
            title: "The Batman",
            type: "movie",
            year: 2022,
            rating: 7.8,
            duration: "176 min",
            genre: ["Acción", "Crimen", "Drama"],
            description: "Batman se aventura en los bajos fondos de Gotham City en una apasionante película de Batman que no se había visto en la gran pantalla.",
            image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            featured: false
        },
        {
            id: 3,
            title: "Dune",
            type: "movie",
            year: 2021,
            rating: 8.0,
            duration: "155 min",
            genre: ["Aventura", "Drama", "Sci-Fi"],
            description: "Paul Atreides, un joven brillante y talentoso nacido con un gran destino más allá de su comprensión, debe viajar al planeta más peligroso del universo.",
            image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            featured: false
        },
        {
            id: 4,
            title: "Top Gun: Maverick",
            type: "movie",
            year: 2022,
            rating: 8.3,
            duration: "130 min",
            genre: ["Acción", "Drama"],
            description: "Después de más de treinta años de servicio como uno de los mejores aviadores de la Armada, Pete 'Maverick' Mitchell está donde pertenece.",
            image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            featured: false
        },
        {
            id: 5,
            title: "Avengers: Endgame",
            type: "movie",
            year: 2019,
            rating: 8.4,
            duration: "181 min",
            genre: ["Acción", "Aventura", "Drama"],
            description: "Después de los devastadores eventos de Avengers: Infinity War, el universo está en ruinas debido a las acciones de Thanos.",
            image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            featured: false
        }
    ],
    
    movies: [
        {
            id: 6,
            title: "Oppenheimer",
            type: "movie",
            year: 2023,
            rating: 8.5,
            duration: "180 min",
            genre: ["Biografía", "Drama", "Historia"],
            description: "La historia del científico estadounidense J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.",
            image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            featured: false
        },
        {
            id: 7,
            title: "Barbie",
            type: "movie",
            year: 2023,
            rating: 7.2,
            duration: "114 min",
            genre: ["Aventura", "Comedia", "Fantasía"],
            description: "Barbie y Ken están pasando el mejor momento de sus vidas en el colorido y aparentemente perfecto mundo de Barbie Land.",
            image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            featured: false
        },
        {
            id: 8,
            title: "John Wick: Chapter 4",
            type: "movie",
            year: 2023,
            rating: 7.8,
            duration: "169 min",
            genre: ["Acción", "Crimen", "Thriller"],
            description: "John Wick descubre una forma de derrotar a la Alta Mesa. Pero antes de que pueda ganar su libertad, Wick debe enfrentarse a un nuevo enemigo.",
            image: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            featured: false
        },
        {
            id: 9,
            title: "Fast X",
            type: "movie",
            year: 2023,
            rating: 5.8,
            duration: "141 min",
            genre: ["Acción", "Aventura", "Crimen"],
            description: "Durante muchas misiones y contra probabilidades imposibles, Dom Toretto y su familia han sido más astutos y más rápidos que todos los enemigos.",
            image: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            featured: false
        },
        {
            id: 10,
            title: "Guardians of the Galaxy Vol. 3",
            type: "movie",
            year: 2023,
            rating: 8.0,
            duration: "150 min",
            genre: ["Acción", "Aventura", "Comedia"],
            description: "Peter Quill, aún recuperándose de la pérdida de Gamora, debe reunir a su equipo para defender el universo.",
            image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            featured: false
        }
    ],
    
    series: [
        {
            id: 11,
            title: "Stranger Things",
            type: "series",
            year: 2016,
            rating: 8.7,
            duration: "4 temporadas",
            genre: ["Drama", "Fantasía", "Horror"],
            description: "Cuando un niño desaparece, su madre, un jefe de policía y sus amigos deben enfrentar fuerzas terroríficas para recuperarlo.",
            image: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            featured: false
        },
        {
            id: 12,
            title: "Wednesday",
            type: "series",
            year: 2022,
            rating: 8.1,
            duration: "1 temporada",
            genre: ["Comedia", "Crimen", "Fantasía"],
            description: "Una mirada sarcástica e inteligente sobre los años de Wednesday Addams como estudiante en la Academia Nevermore.",
            image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            featured: false
        },
        {
            id: 13,
            title: "House of the Dragon",
            type: "series",
            year: 2022,
            rating: 8.4,
            duration: "2 temporadas",
            genre: ["Acción", "Aventura", "Drama"],
            description: "Una precuela de Game of Thrones que narra la historia de la Casa Targaryen.",
            image: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            featured: false
        },
        {
            id: 14,
            title: "The Crown",
            type: "series",
            year: 2016,
            rating: 8.6,
            duration: "6 temporadas",
            genre: ["Biografía", "Drama", "Historia"],
            description: "Sigue la vida política y personal de la Reina Isabel II de Inglaterra, desde su boda en 1947 hasta la actualidad.",
            image: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            featured: false
        },
        {
            id: 15,
            title: "The Witcher",
            type: "series",
            year: 2019,
            rating: 8.2,
            duration: "3 temporadas",
            genre: ["Acción", "Aventura", "Drama"],
            description: "Geralt de Rivia, un cazador de monstruos solitario, lucha por encontrar su lugar en un mundo donde las personas a menudo resultan más malvadas que las bestias.",
            image: "https://image.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            featured: false
        }
    ],
    
    action: [
        {
            id: 16,
            title: "Mad Max: Fury Road",
            type: "movie",
            year: 2015,
            rating: 8.1,
            duration: "120 min",
            genre: ["Acción", "Aventura", "Sci-Fi"],
            description: "En un futuro apocalíptico, Max se une a Furiosa para huir de un señor de la guerra y su ejército en una guerra en la carretera.",
            image: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            featured: false
        },
        {
            id: 17,
            title: "Mission: Impossible - Dead Reckoning",
            type: "movie",
            year: 2023,
            rating: 7.8,
            duration: "163 min",
            genre: ["Acción", "Aventura", "Thriller"],
            description: "Ethan Hunt y su equipo del IMF se embarcan en su misión más peligrosa hasta la fecha.",
            image: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            featured: false
        },
        {
            id: 18,
            title: "The Matrix",
            type: "movie",
            year: 1999,
            rating: 8.7,
            duration: "136 min",
            genre: ["Acción", "Sci-Fi"],
            description: "Un programador es llevado a una rebelión subterránea contra las máquinas que han conquistado el mundo.",
            image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            featured: false
        },
        {
            id: 19,
            title: "Die Hard",
            type: "movie",
            year: 1988,
            rating: 8.2,
            duration: "132 min",
            genre: ["Acción", "Thriller"],
            description: "Un policía de Nueva York lucha contra terroristas en un rascacielos de Los Ángeles en Nochebuena.",
            image: "https://image.tmdb.org/t/p/w500/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            featured: false
        },
        {
            id: 20,
            title: "Terminator 2: Judgment Day",
            type: "movie",
            year: 1991,
            rating: 8.6,
            duration: "137 min",
            genre: ["Acción", "Sci-Fi"],
            description: "Un cyborg, idéntico al que falló en matar a Sarah Connor, debe proteger a su hijo adolescente John Connor de un Terminator más avanzado.",
            image: "https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg",
            trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            featured: false
        }
    ]
};

// Datos adicionales para funcionalidades
const genres = [
    "Acción", "Aventura", "Animación", "Biografía", "Comedia", "Crimen", 
    "Documental", "Drama", "Familia", "Fantasía", "Historia", "Horror", 
    "Música", "Misterio", "Romance", "Sci-Fi", "Deporte", "Thriller", "Guerra", "Western"
];

const years = Array.from({length: 30}, (_, i) => 2024 - i);

// Configuración de la aplicación
const appConfig = {
    api: {
        imageBase: "https://image.tmdb.org/t/p/w500",
        videoBase: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/"
    },
    sliderSettings: {
        spaceBetween: 20,
        slidesPerView: 'auto',
        freeMode: true,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 2.2,
                spaceBetween: 10
            },
            480: {
                slidesPerView: 2.8,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 3.5,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 4.5,
                spaceBetween: 20
            },
            1200: {
                slidesPerView: 5.5,
                spaceBetween: 20
            },
            1400: {
                slidesPerView: 6.5,
                spaceBetween: 20
            }
        }
    },
    particlesConfig: {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#e50914"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#e50914",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    }
};

// Función para obtener datos por categoría
function getMoviesByCategory(category) {
    return movieData[category] || [];
}

// Función para obtener todas las películas y series
function getAllContent() {
    return [...movieData.trending, ...movieData.movies, ...movieData.series, ...movieData.action];
}

// Función para buscar contenido
function searchContent(query) {
    const allContent = getAllContent();
    const searchTerm = query.toLowerCase();
    
    return allContent.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.genre.some(g => g.toLowerCase().includes(searchTerm))
    );
}

// Función para obtener contenido por género
function getContentByGenre(genre) {
    const allContent = getAllContent();
    return allContent.filter(item => item.genre.includes(genre));
}

// Función para obtener contenido por año
function getContentByYear(year) {
    const allContent = getAllContent();
    return allContent.filter(item => item.year === year);
}

// Función para obtener contenido por tipo
function getContentByType(type) {
    const allContent = getAllContent();
    return allContent.filter(item => item.type === type);
}

// Función para obtener contenido destacado
function getFeaturedContent() {
    const allContent = getAllContent();
    return allContent.filter(item => item.featured);
}

// Función para obtener contenido aleatorio
function getRandomContent(count = 10) {
    const allContent = getAllContent();
    const shuffled = allContent.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        movieData,
        genres,
        years,
        appConfig,
        getMoviesByCategory,
        getAllContent,
        searchContent,
        getContentByGenre,
        getContentByYear,
        getContentByType,
        getFeaturedContent,
        getRandomContent
    };
}
