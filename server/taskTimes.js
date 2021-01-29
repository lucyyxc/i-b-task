// This is just for the dates of the task, this will not change the task names. That would be done if create_new_user_tasks.sql

const taskTimes = [
  {
      name: "Share your engagement news!",
      startDate: 365,
      endDate: 362,

  },
  {
      name: "Decide if you would like to have an engagement party",
      startDate: 364,
      endDate: 357,

  },
  {
      name: "Create rough draft guest list",
      startDate: 363,
      endDate: 359,

  },
  {
      name: "Create budget",
      startDate: 362,
      endDate: 338,

  },
  {
      name: "Get the email address with your new last name",
      startDate: 361,
      endDate: 361,

  },
  {
      name: "Discuss potential wedding date options",
      startDate: 361,
      endDate: 358,

  },
  {
      name: "Determine wedding location",
      startDate: 360,
      endDate: 337,

  },
  {
      name: "Create vision board",
      startDate: 359,
      endDate: 352,

  },
  {
      name: "Create wedding specific email address",
      startDate: 358,
      endDate: 358,

  },
  {
      name: "Book reception venue ",
      startDate: 360,
      endDate: 327,

  },
  {
      name: "Book ceremony venue",
      startDate: 357,
      endDate: 305,

  },
  {
      name: "Create wedding documents folder",
      startDate: 333,
      endDate: 331,

  },
  {
      name: "Create wedding website",
      startDate: 242,
      endDate: 210,

  },
  {
      name: "Finalize guest list",
      startDate: 328,
      endDate: 321,

  },
  {
      name: "Decide on your bridesmaids and groomsmen",
      startDate: 350,
      endDate: 326,

  },
  {
      name: "Decide on your remaining wedding party",
      startDate: 325,
      endDate: 311,

  },
  {
      name: "Book caterer",
      startDate: 324,
      endDate: 296,

  },
  {
      name: "Book videographer",
      startDate: 311,
      endDate: 291,

  },
  {
      name: "Purchase wedding dress",
      startDate: 351,
      endDate: 298,

  },
  {
      name: "Book photographer",
      startDate: 300,
      endDate: 274,

  },
  {
      name: "Book florist",
      startDate: 297,
      endDate: 281,

  },
  {
      name: "Book DJ/musical guest",
      startDate: 293,
      endDate: 264,

  },
  {
      name: "Book hair stylist ",
      startDate: 304,
      endDate: 276,

  },
  {
      name: "Book makeup artist ",
      startDate: 304,
      endDate: 276,

  },
  {
      name: "Secure hotel room blocks",
      startDate: 283,
      endDate: 271,

  },
  {
      name: "Determine save the date design ",
      startDate: 280,
      endDate: 266,

  },
  {
      name: "Create gift registry ",
      startDate: 267,
      endDate: 246,

  },
  {
      name: "Book photo booth",
      startDate: 316,
      endDate: 301,

  },
  {
      name: "Collect guest mailing addresses",
      startDate: 267,
      endDate: 253,

  },
  {
      name: "Decide the wedding day photography schedule",
      startDate: 267,
      endDate: 254,

  },
  {
      name: "Decide on bridal shower date options",
      startDate: 324,
      endDate: 317,

  },
  {
      name: "Decide key Bachelorette party details",
      startDate: 318,
      endDate: 312,

  },
  {
      name: "Purchase save the date cards",
      startDate: 265,
      endDate: 258,

  },
  {
      name: "Purchase bride's wedding ring",
      startDate: 259,
      endDate: 232,

  },
  {
      name: "Purchase groom's wedding ring",
      startDate: 259,
      endDate: 232,

  },
  {
      name: "Purchase insurance for wedding rings",
      startDate: 230,
      endDate: 223,

  },
  {
      name: "Schedule engagement photos ",
      startDate: 248,
      endDate: 243,

  },
  {
      name: "Book musicians for the ceremony",
      startDate: 239,
      endDate: 209,

  },
  {
      name: "Book day of wedding planner/coordinator",
      startDate: 257,
      endDate: 236,

  },
  {
      name: "Book cake baker",
      startDate: 252,
      endDate: 231,

  },
  {
      name: "Buy stamps for save the date/invitations",
      startDate: 231,
      endDate: 225,

  },
  {
      name: "Create transportation plan for wedding party",
      startDate: 235,
      endDate: 216,

  },
  {
      name: "Secure wedding officiant",
      startDate: 227,
      endDate: 209,

  },
  {
      name: "Book wedding night hotel room",
      startDate: 270,
      endDate: 266,

  },
  {
      name: "Book rehearsal dinner venue",
      startDate: 221,
      endDate: 197,

  },
  {
      name: "Buy or rent groom's wedding suit/tux",
      startDate: 218,
      endDate: 190,

  },
  {
      name: "Create a weather plan 'B'",
      startDate: 215,
      endDate: 188,

  },
  {
      name: "Determine wedding reception decorations",
      startDate: 212,
      endDate: 167,

  },
  {
      name: "Send save the dates",
      startDate: 209,
      endDate: 204,

  },
  {
      name: "Order wedding invitations",
      startDate: 208,
      endDate: 195,

  },
  {
      name: "Determine cake style/flavor",
      startDate: 200,
      endDate: 175,

  },
  {
      name: "Buy wedding shoes",
      startDate: 208,
      endDate: 180,

  },
  {
      name: "Determine wedding day hair style",
      startDate: 146,
      endDate: 140,

  },
  {
      name: "Determine wedding day makeup",
      startDate: 146,
      endDate: 140,

  },
  {
      name: "Book/meet with rental and lighting pros",
      startDate: 192,
      endDate: 164,

  },
  {
      name: "Purchase flower girl dress",
      startDate: 195,
      endDate: 181,

  },
  {
      name: "Purchase flower girl accessories ",
      startDate: 187,
      endDate: 176,

  },
  {
      name: "Create guest experience flow ",
      startDate: 190,
      endDate: 166,

  },
  {
      name: "Determine bridesmaid dresses/share with wedding party",
      startDate: 180,
      endDate: 154,

  },
  {
      name: "Arrange guest shuttle, parking, and/or valet at reception venue",
      startDate: 177,
      endDate: 157,

  },
  {
      name: "Order rental items",
      startDate: 175,
      endDate: 168,

  },
  {
      name: "Start premarital counseling ",
      startDate: 172,
      endDate: 158,

  },
  {
      name: "Determine bridesmaids shoes",
      startDate: 167,
      endDate: 150,

  },
  {
      name: "Plan welcome party",
      startDate: 165,
      endDate: 139,

  },
  {
      name: "Plan day after wedding ",
      startDate: 162,
      endDate: 131,

  },
  {
      name: "Schedule wedding dress alteration/fitting",
      startDate: 163,
      endDate: 163,

  },
  {
      name: "Purchase headpiece/veil",
      startDate: 157,
      endDate: 143,

  },
  {
      name: "Create guest list for rehearsal dinner",
      startDate: 156,
      endDate: 153,

  },
  {
      name: "Purchase rehearsal dinner invitations",
      startDate: 153,
      endDate: 148,

  },
  {
      name: "Prep wedding invitations",
      startDate: 150,
      endDate: 147,

  },
  {
      name: "Confirm wedding guest RSVP names",
      startDate: 148,
      endDate: 147,

  },
  {
      name: "Send wedding invitations",
      startDate: 146,
      endDate: 146,

  },
  {
      name: "Determine ceremony decorations",
      startDate: 143,
      endDate: 123,

  },
  {
      name: "Monitor RSVPs",
      startDate: 139,
      endDate: 75,

  },
  {
      name: "Order wedding favors",
      startDate: 140,
      endDate: 122,

  },
  {
      name: "Schedule wedding day hair trial",
      startDate: 138,
      endDate: 138,

  },
  {
      name: "Schedule wedding day makeup trial",
      startDate: 137,
      endDate: 137,

  },
  {
      name: "Create displays and signage for reception",
      startDate: 136,
      endDate: 112,

  },
  {
      name: "Purchase cake topper",
      startDate: 139,
      endDate: 133,

  },
  {
      name: "Buy under-the-dress essentials",
      startDate: 224,
      endDate: 219,

  },
  {
      name: "Decide on guest book",
      startDate: 130,
      endDate: 116,

  },
  {
      name: "Book dance lessons ",
      startDate: 128,
      endDate: 121,

  },
  {
      name: "Determine suit/tux for groomsmen/share with wedding party",
      startDate: 126,
      endDate: 120,

  },
  {
      name: "Send rehearsal dinner invitations",
      startDate: 122,
      endDate: 115,

  },
  {
      name: "Purchase bridesmaid gifts",
      startDate: 121,
      endDate: 100,

  },
  {
      name: "Purchase groomsmen gifts",
      startDate: 120,
      endDate: 114,

  },
  {
      name: "Buy gifts and/or activities for the flower girl(s)/ring bearer(s)",
      startDate: 111,
      endDate: 105,

  },
  {
      name: "Purchase gifts for other VIP's",
      startDate: 114,
      endDate: 108,

  },
  {
      name: "Determine jewelry/accessories for wedding day",
      startDate: 116,
      endDate: 102,

  },
  {
      name: "Determine groom's accessories for wedding day",
      startDate: 115,
      endDate: 109,

  },
  {
      name: "Finalize flowers with florist",
      startDate: 113,
      endDate: 99,

  },
  {
      name: "Determine bridesmaids bouquets",
      startDate: 105,
      endDate: 99,

  },
  {
      name: "Determine boutonnieres and corsages for VIPs",
      startDate: 110,
      endDate: 105,

  },
  {
      name: "Order flower petals & basket(s) for flower girl(s)",
      startDate: 98,
      endDate: 98,

  },
  {
      name: "Purchase ring bearer pillow(s)",
      startDate: 108,
      endDate: 101,

  },
  {
      name: "Create playlist for wedding ceremony",
      startDate: 101,
      endDate: 85,

  },
  {
      name: "Determine readings for wedding ceremony",
      startDate: 98,
      endDate: 84,

  },
  {
      name: "Write/determine vows",
      startDate: 104,
      endDate: 77,

  },
  {
      name: "Determine how parents will walk into the ceremony",
      startDate: 102,
      endDate: 102,

  },
  {
      name: "Determine grandparents ushers",
      startDate: 101,
      endDate: 101,

  },
  {
      name: "Plan big exit from the ceremony",
      startDate: 100,
      endDate: 93,

  },
  {
      name: "Schedule and meet with officiant",
      startDate: 100,
      endDate: 87,

  },
  {
      name: "Create full ceremony plan and share as needed",
      startDate: 99,
      endDate: 72,

  },
  {
      name: "Finalize wedding reception menu",
      startDate: 95,
      endDate: 89,

  },
  {
      name: "Plan after party",
      startDate: 88,
      endDate: 75,

  },
  {
      name: "Plan days leading up to wedding",
      startDate: 81,
      endDate: 75,

  },
  {
      name: "Determine cocktails/wine for reception",
      startDate: 87,
      endDate: 81,

  },
  {
      name: "Purchase bridal party getting ready outfits",
      startDate: 85,
      endDate: 79,

  },
  {
      name: "Determine wedding photo locations/create shot list",
      startDate: 77,
      endDate: 71,

  },
  {
      name: "Create wedding weekend schedules for VIPs",
      startDate: 74,
      endDate: 61,

  },
  {
      name: "Determine welcome gift",
      startDate: 80,
      endDate: 74,

  },
  {
      name: "Make any additional hair appointments for days prior ",
      startDate: 78,
      endDate: 78,

  },
  {
      name: "Create list of must play and do not play songs for DJ",
      startDate: 77,
      endDate: 70,

  },
  {
      name: "Create photo slideshow for reception",
      startDate: 75,
      endDate: 62,

  },
  {
      name: "Create name tags for reception",
      startDate: 73,
      endDate: 67,

  },
  {
      name: "Request time off work for wedding and honeymoon",
      startDate: 72,
      endDate: 72,

  },
  {
      name: "Request bridesmaids to choose wedding hair style",
      startDate: 71,
      endDate: 58,

  },
  {
      name: "Purchase cologne for wedding day",
      startDate: 70,
      endDate: 62,

  },
  {
      name: "Purchase perfume for wedding day",
      startDate: 70,
      endDate: 62,

  },
  {
      name: "Create baskets for wedding reception restrooms",
      startDate: 51,
      endDate: 38,

  },
  {
      name: "Build wedding day 'emergency' kit",
      startDate: 50,
      endDate: 37,

  },
  {
      name: "Purchase rehearsal dinner outfit",
      startDate: 66,
      endDate: 52,

  },
  {
      name: "Choose something blue, borrowed, old and new",
      startDate: 65,
      endDate: 58,

  },
  {
      name: "Choose prayer/welcome toast ",
      startDate: 63,
      endDate: 57,

  },
  {
      name: "Make nail and spa appointments",
      startDate: 61,
      endDate: 60,

  },
  {
      name: "Design wedding program for ceremony & print",
      startDate: 60,
      endDate: 53,

  },
  {
      name: "Determine photo sharing app to gather guests photos",
      startDate: 58,
      endDate: 51,

  },
  {
      name: "Create plan 'B' communication plan for wedding day ",
      startDate: 57,
      endDate: 50,

  },
  {
      name: "Create schedule for toasts at wedding reception",
      startDate: 55,
      endDate: 55,

  },
  {
      name: "Write rehearsal and wedding reception toast",
      startDate: 54,
      endDate: 40,

  },
  {
      name: "Create hashtag",
      startDate: 52,
      endDate: 45,

  },
  {
      name: "Write VIP thank yous",
      startDate: 57,
      endDate: 45,

  },
  {
      name: "Create signage ",
      startDate: 47,
      endDate: 17,

  },
  {
      name: "Order name cards and table numbers",
      startDate: 37,
      endDate: 31,

  },
  {
      name: "Put together outfits for days before and after wedding",
      startDate: 40,
      endDate: 29,

  },
  {
      name: "Create rehearsal dinner menu",
      startDate: 42,
      endDate: 35,

  },
  {
      name: "Create traveling guest google form",
      startDate: 41,
      endDate: 34,

  },
  {
      name: "Create pre-wedding ceremony menu ",
      startDate: 38,
      endDate: 31,

  },
  {
      name: "Appoint gift and card retriever ",
      startDate: 33,
      endDate: 26,

  },
  {
      name: "Contact people who have not RSVP'd",
      startDate: 31,
      endDate: 30,

  },
  {
      name: "Break in shoes for wedding day and purchase padding",
      startDate: 31,
      endDate: 10,

  },
  {
      name: "Design/print wedding reception menu",
      startDate: 30,
      endDate: 28,

  },
  {
      name: "Arrange/communicate transportation for VIP guests",
      startDate: 29,
      endDate: 27,

  },
  {
      name: "Ask photographer, DJ, etc. for food preference",
      startDate: 29,
      endDate: 27,

  },
  {
      name: "Create seating chart for the wedding reception",
      startDate: 28,
      endDate: 14,

  },
  {
      name: "Create entree indicators",
      startDate: 27,
      endDate: 21,

  },
  {
      name: "Get marriage license",
      startDate: 26,
      endDate: 22,

  },
  {
      name: "Get hand steamer for dresses",
      startDate: 36,
      endDate: 32,

  },
  {
      name: "Send email for wedding rehearsal with special instructions",
      startDate: 25,
      endDate: 22,

  },
  {
      name: "Send extended family email with special instructions ",
      startDate: 25,
      endDate: 22,

  },
  {
      name: "Confirm payment with vendors",
      startDate: 19,
      endDate: 17,

  },
  {
      name: "Send your day of schedule to all vendors",
      startDate: 13,
      endDate: 11,

  },
  {
      name: "Appoint person to check into hotel",
      startDate: 21,
      endDate: 21,

  },
  {
      name: "Gather getting ready magazines, books, music, etc.",
      startDate: 21,
      endDate: 14,

  },
  {
      name: "Send email to guests with all important details  ",
      startDate: 20,
      endDate: 15,

  },
  {
      name: "Create packing lists",
      startDate: 13,
      endDate: 8,

  },
  {
      name: "Submit final numbers to caterer",
      startDate: 17,
      endDate: 14,

  },
  {
      name: "Pay vendors",
      startDate: 16,
      endDate: 14,

  },
  {
      name: "Delegate person to make day of payments and deliver tips",
      startDate: 15,
      endDate: 15,

  },
  {
      name: "Write morning of cards to exchange",
      startDate: 14,
      endDate: 7,

  },
  {
      name: "Request early check in",
      startDate: 7,
      endDate: 7,

  },
  {
      name: "Clean engagement ring",
      startDate: 6,
      endDate: 6,

  },
  {
      name: "Pack for wedding night",
      startDate: 5,
      endDate: 3,

  },
  {
      name: "Share a video on how to pin on a boutineer with the wedding party",
      startDate: 0,
      endDate: 0,

  },
  {
      name: "Change relationship status and last name on social media",
      startDate: -1,
      endDate: -1,

  },
  {
      name: "Launch new email address & set up forwarding",
      startDate: -3,
      endDate: -3,

  },
  {
      name: "Get wedding dress cleaned and preserved",
      startDate: -4,
      endDate: -45,

  },
  {
      name: "Change your name legally",
      startDate: -25,
      endDate: -40,

  },
  {
      name: "Send thank you cards",
      startDate: -26,
      endDate: -56,

  },
  {
      name: "Write reviews on wedding vendors",
      startDate: -30,
      endDate: -44,

  },
  {
      name: "Review wedding photos and post favorites",
      startDate: -90,
      endDate: -104,

  },
  {
      name: "Create/order wedding album",
      startDate: -100,
      endDate: -114,

  },
];

module.exports = taskTimes;
