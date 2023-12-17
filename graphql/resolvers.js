import { MongoClient } from 'mongodb';

// Connection URI
// version container
//const uri = 'mongodb://root:example@mongodb:27017'
// version runtime
const uri = 'mongodb://root:example@localhost:27017';

// Database Name
const dbName = 'dba';

// Collection Name
const collectionName = 'sales';

// Create a new MongoClient
const client = new MongoClient(uri);

await client.connect();
console.log('Connected successfully to the server');
const db = client.db(dbName);
const collection = db.collection(collectionName);

const resolvers = {
    Query: {
      prestations: async (_, { prestationId, minSum, maxSum }) => {
        // Préparation des conditions de correspondance
        let matchConditions = {};
    
        if (prestationId !== undefined) {
            matchConditions['prestation.id'] = prestationId;
        }
    
        if (minSum !== undefined || maxSum !== undefined) {
            matchConditions.price = {};
            if (minSum !== undefined) matchConditions.price.$gte = minSum;
            if (maxSum !== undefined) matchConditions.price.$lte = maxSum;
        }
    
        const pipeline = [
            {
                $match: matchConditions
            },
            {
                $group: {
                    _id: {
                        prestation_id: '$prestation.id',
                        prestation_description: '$prestation.description'
                    },
                    sum: {
                        $sum: '$price'
                    },
                    avg: {
                        $avg: '$price'
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    id: '$_id.prestation_id',
                    description: '$_id.prestation_description',
                    sum: 1,
                    avg: 1,
                    count: 1,
                    _id: 0
                }
            }
        ];
    
        try {
            const prestations = await collection.aggregate(pipeline).toArray();
            return prestations;
        } catch (error) {
            throw new Error("Erreur lors de la récupération des prestations: " + error.message);
        }
    }
    ,
  departments: async (_, { departmentId, minSum, maxSum }) => {
      // Préparation des conditions de correspondance
      let matchConditions = {};

      if (departmentId !== undefined) matchConditions['address.department.id'] = departmentId;
      if (minSum !== undefined || maxSum !== undefined) {
          matchConditions.price = {};
          if (minSum !== undefined) matchConditions.price.$gte = minSum;
          if (maxSum !== undefined) matchConditions.price.$lte = maxSum;
      }

      const pipeline = [
          {
              $match: matchConditions
          },
          {
              $group: {
                  _id: "$address.department.id",
                  name: { $first: "$address.department.name" },
                  sum: { $sum: "$price" }, // Assure-toi que le champ 'sum' existe dans tes données
                  count: { $sum: 1 },
                  avg: { $avg: "$price" }
              }
          },
          {
              $project: {
                  id: "$_id",
                  name: 1,
                  sum: 1,
                  count: 1,
                  avg: 1,
                  _id: 0
              }
          }
      ];

      try {
          const departments = await collection.aggregate(pipeline).toArray();
          return departments;
      } catch (error) {
          throw new Error("Erreur lors de la récupération des départements: " + error.message);
      }
  },
  seeAllAddresses: async (root, { id, city, latitude, longitude, department, region }, context) => {
    let query = {};
    if (id) query['address.id'] = id;
    if (city !== undefined) query['address.city.name'] = new RegExp(city, 'i');
    if (latitude !== undefined) query['address.latitude'] = latitude;
    if (longitude !== undefined) query['address.longitude'] = longitude;
    if (department && department.id) query['address.department.id'] = department.id;
    if (region && region.id) query['address.region.id'] = region.id;

    const pipeline = [
        { $match: query },
        {
            $group: {
                _id: "$address.department.id",
                avgPrice: { $avg: "$price" },
                sum: { $sum: "$price" },
                count: { $sum: 1 },
                departmentName: { $first: "$address.department.name" },
                regionId: { $first: "$address.region.id" },
                regionName: { $first: "$address.region.name" },
                city: { $first: "$address.city" },
                latitude: { $first: "$address.latitude" },
                longitude: { $first: "$address.longitude" },
                addressId: { $first: "$address.id" }
            }
        },
        {
            $project: {
                id: "$addressId",
                city: 1,
                latitude: 1,
                longitude: 1,
                department: {
                    id: "$_id",
                    name: "$departmentName",
                    avg: "$avgPrice",
                    sum: "$sum",
                    count: "$count"
                },
                region: {
                    id: "$regionId",
                    name: "$regionName"
                }
            }
        }
    ];

    const addresses = await collection.aggregate(pipeline).toArray();

    return addresses.map(item => {
        return {
            id: item.id,
            city: item.city,
            latitude: item.latitude,
            longitude: item.longitude,
            department: item.department,
            region: item.region
        };
    });
}

,


  clients: async (_, { clientId, lastname, firstname, city }) => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    let query = {};

    if (clientId !== undefined) query['client.id'] = clientId;
    if (lastname !== undefined) query['client.lastname'] = new RegExp(lastname, 'i'); // Recherche insensible à la casse
    if (firstname !== undefined) query['client.firstname'] = new RegExp(firstname, 'i');
    if (city !== undefined) query['client.city.name'] = new RegExp(cityName, 'i');

    try {
        const clients = await collection.find(query, { projection: { client: 1 } }).toArray();
        
        return clients.map(item => {
            return {
                id: item.client.id,
                lastname: item.client.lastname,
                firstname: item.client.firstname,
                street: item.client.street,
                zip: item.client.zip,
                city: item.client.city ? {
                  id: item.client.city.id,
                  name: item.client.city.name,
                  department: {
                      // Ici, tu dois mapper les informations du département
                      id: item.client.city.department ? item.client.city.department.id : null,
                      name: item.client.city.department ? item.client.city.department.name : null,

                      // Ici j'ai fais le choix de laisser ces valeurs à null et de ne pas utiliser d'agrégation pour chaque client car je pense que ca va etre tres couteux en ressources
                      sum: item.client.city.department ? item.client.city.department.sum : null,
                      avg: item.client.city.department ? item.client.city.department.avg : null,
                      count: item.client.city.department ? item.client.city.department.count : null
                  },
                  region: {
                      // De même pour la région
                      id: item.client.city.region ? item.client.city.region.id : null,
                      name: item.client.city.region ? item.client.city.region.name : null,
                      // et les autres champs de la région
                  }
              } : null
            };
        });
    } catch (error) {
        throw new Error("Erreur lors de la récupération des clients: " + error.message);
    }
  },


  dates: async (_, { year, month, day, dayName, hour, minute, monthName, text, trimester }) => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    let query = {};
    if (year !== undefined) query['date.year'] = year;
    if (month !== undefined) query['date.month'] = month;
    if (day !== undefined) query['date.day'] = day;
    if (dayName !== undefined) query['date.day_name'] = new RegExp(dayName, 'i');
    if (hour !== undefined) query['date.hour'] = hour;
    if (minute !== undefined) query['date.minute'] = minute;
    if (monthName !== undefined) query['date.month_name'] = new RegExp(monthName, 'i');
    if (text !== undefined) query['date.text'] = new RegExp(text, 'i');
    if (trimester !== undefined) query['date.trimester'] = trimester;

    const dates = await collection.find(query, { projection: { date: 1 } }).toArray();
    
    return dates.map(item => {
        return {
            id: item.date.id,
            text: item.date.text,
            year: item.date.year,
            trimester: item.date.trimester,
            month: item.date.month,
            month_name: item.date.month_name,
            day: item.date.day,
            day_name: item.date.day_name,
            hour: item.date.hour,
            minute: item.date.minute
        };
    });
  },
  
  // Toutes les ventes
  sales: async (_, {prestationId, departmentId, minSum, maxSum}) => {
    // Préparation des conditions de correspondance
    let matchConditions = {};
    if (prestationId !== undefined) {
      matchConditions['prestation.id'] = prestationId;
    }

    if (departmentId !== undefined) {
      matchConditions['address.department.id'] = departmentId;
    }

    if (minSum !== undefined || maxSum !== undefined) {
      matchConditions.price = {};
      if (minSum !== undefined) matchConditions.price.$gte = minSum;
      if (maxSum !== undefined) matchConditions.price.$lte = maxSum;
    }

    // Préparation de l'aggrégation
    const pipeline = [
      {
        $match: matchConditions
      },
      {
        $group: {
          _id: {
            departement_id: '$address.department.id',
            name: '$address.department.name',
            prestation_id: '$prestation.id',
            prestation_description: '$prestation.description',
          },
          sum: {
            $sum: '$price'
          },
          avg: {
            $avg: '$price'
          },
          count: {
            $sum: 1
          },

          minSum: {
            $min: '$price'
          },

          maxSum: {
            $max: '$price'
          },

        }
      },
      {
        $project: {
          prestationId: '$_id.prestation_id',
          prestationDescription: '$_id.prestation_description',
          departementId: '$_id.departement_id',
          name: '$_id.name',
          sum: 1,
          avg: 1,
          count: 1,
          minSum: 1,
          maxSum: 1,
          _id: 0
        }
      }
    ];

    // Exécution de l'aggrégation
    try{
      const sales = await collection.aggregate(pipeline).toArray();
      return sales;
    }
    catch(error){
      throw new Error("Erreur lors de récupération des ventes : " + error.message);
    }
  },

  // Afficher la date où il y a eu le plus de ventes et dans quel département et pour quelle prestation, et dans quelle region, et dans quelle ville  (avec le prix moyen, le prix total, le nombre de ventes)

  mostSales: async (_, { prestationId, departmentId, regionId, cityId }) => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    let query = {};

    if (prestationId !== undefined) query['prestation.id'] = prestationId;
    if (departmentId !== undefined) query['address.department.id'] = departmentId;
    if (regionId !== undefined) query['address.region.id'] = regionId;
    if (cityId !== undefined) query['address.city.id'] = cityId;

    try {
        const mostSales = await collection.find(query, { projection: { date: 1 } }).toArray();
        
        return mostSales.map(item => {
            return {
                id: item.date.id,
                text: item.date.text,
                year: item.date.year,
                trimester: item.date.trimester,
                month: item.date.month,
                month_name: item.date.month_name,
                day: item.date.day,
                day_name: item.date.day_name,
                hour: item.date.hour,
                minute: item.date.minute
            };
        });
    } catch (error) {
        throw new Error("Erreur lors de la récupération des dates: " + error.message);
    }
  },

    }
}

export default resolvers;
