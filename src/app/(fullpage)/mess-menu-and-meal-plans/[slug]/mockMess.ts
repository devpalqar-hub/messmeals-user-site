import type { MessDetails } from "../../../../types/mess";

/**
 * Default mock payload (exact shape of GET /open/mess/{slug}).
 * Rendered at /m/preview for instant local preview without the API.
 */
export const MOCK_MESS: MessDetails = {
  id: "a88fed18-2bfa-4be9-ae79-974c5f093ccd",
  slug: "procafi-healthy-and-high-protein",
  messName: "Procafi healthy and high protein",
  description:
    "𝗦𝘁𝗮𝘆 ചുമ്മാ 𝗙𝗶𝘁. \n𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗵𝗲𝗮𝗹𝘁𝗵𝘆 𝗺𝗲𝗮𝗹𝘀 𝗳𝗼𝗿 𝗯𝘂𝘀𝘆 𝗽𝗲𝗼𝗽𝗹𝗲 𝗶𝗻 𝗞𝗼𝗰𝗵𝗶.\n▪️ Healthy Grilled \n▪️ Protein Rice Bowl \n▪️ Protein Smoothies\n▪️Protein Rainbow Salads\n𝙁𝙧𝙚𝙚 𝙙𝙚𝙡𝙞𝙫𝙚𝙧𝙮 3 𝙠𝙢 𝙧𝙖𝙙𝙞𝙪𝙨 𝙖𝙧𝙤𝙪𝙣𝙙 𝙢𝙚. \n\nAll meals are healthy and No harmful ingredients, Cooked with olive oil. Also you can add your favourite foods. 500 calories less. Low fat, High  Protein & fibre.",
  logo: "https://dev-palqar-bucket.s3.ap-south-1.amazonaws.com/uploads/1791626722689-fa9e043dam6.jpg",
  coverImage:
    "https://dev-palqar-bucket.s3.ap-south-1.amazonaws.com/uploads/1791626759094-p7k5h95ssl.jpg",
  gallery: [],
  address: {
    address:
      "AC City Silver Castle Apartments1st floorflat no: 1FJanatha Rd, Janatha,Thykoodam, Vyttila, Ernakulam, Kerala 682019",
    location: "Kochi, Kerala",
    zipcode: "682019",
    latitude: null,
    longitude: null,
    district: null,
  },
  phone: "+917907443516",
  email: "procafibox@gmail.com",
  openingHours: {},
  features: [],
  status: {
    isVerified: false,
    isFeatured: true,
    isPremium: false,
  },
  foodTypes: ["VEG", "NON_VEG"],
  tags: [
    "MONTHLY_PLANS",
    "DAILY_FRESH_MEALS",
    "HYGIENIC_KITCHEN",
    "AFFORDABLE_PRICING",
    "VEG_AND_NON_VEG",
    "QUALITY_INGREDIENTS",
    "CONSISTENT_TASTE",
    "STUDENT_FRIENDLY",
    "FAMILY_MESS",
    "NO_HIDDEN_CHARGES",
    "TRUSTED_MESS",
  ],
  plans: [
    {
      id: "03d2dece-fc7a-4036-8071-6cac23ed3c46",
      planName: "Weekly subscription plan",
      description: "",
      price: "2999",
      minPrice: "2880",
      isMonthlyPlan: false,
      isDailyPlan: true,
      images: [],
      variations: [
        {
          id: "7a8d4f40-9637-465d-af61-a2dab695300f",
          title: "Dinner",
          description: null,
        },
        {
          id: "b26c8959-2a8a-47fc-9f2a-144da69e207a",
          title: "Lunch",
          description: null,
        },
      ],
      menus: [
        {
          id: "7dedea63-cc73-4b0f-9ba2-2d7f05b9bc4f",
          name: "Subscription plan",
          schedule: {
            FRIDAY: [
              {
                items: "Rice Bowl protein bowl",
                variationId: "b26c8959-2a8a-47fc-9f2a-144da69e207a",
              },
              {
                items: "30g / 50g protein bowl",
                variationId: "7a8d4f40-9637-465d-af61-a2dab695300f",
              },
            ],
            MONDAY: [
              {
                items: "Healthy Rice Bowl Veg and non veg",
                variationId: "b26c8959-2a8a-47fc-9f2a-144da69e207a",
              },
              {
                items: "High Protein Meals.",
                variationId: "7a8d4f40-9637-465d-af61-a2dab695300f",
              },
            ],
            SUNDAY: [],
            TUESDAY: [
              {
                items: "Rice Bowl Veg and non veg",
                variationId: "b26c8959-2a8a-47fc-9f2a-144da69e207a",
              },
              {
                items: "30g High Protein Meals",
                variationId: "7a8d4f40-9637-465d-af61-a2dab695300f",
              },
            ],
            SATURDAY: [
              {
                items: "Rice bowl protein bowl",
                variationId: "b26c8959-2a8a-47fc-9f2a-144da69e207a",
              },
              {
                items: "30g / 50g protein bowl",
                variationId: "7a8d4f40-9637-465d-af61-a2dab695300f",
              },
            ],
            THURSDAY: [
              {
                items: "High Protein Rice Bowl and salad",
                variationId: "b26c8959-2a8a-47fc-9f2a-144da69e207a",
              },
              {
                items: "30g / 50g protein bowl",
                variationId: "7a8d4f40-9637-465d-af61-a2dab695300f",
              },
            ],
            WEDNESDAY: [
              {
                items: "Rice Bowl Veg and non veg",
                variationId: "b26c8959-2a8a-47fc-9f2a-144da69e207a",
              },
              {
                items: "30g / 50g Protein bowl",
                variationId: "7a8d4f40-9637-465d-af61-a2dab695300f",
              },
            ],
          },
        },
      ],
    },
  ],
};
