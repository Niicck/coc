var app = angular.module('app');

app.factory('rootServices', function($http) {
    var committees = {};

    committees.healthEducationLaborPension = [{
        type: "committee",
        committeeName: "Senate Committee on Health, Education, Labor, and Pensions",
        objective: "Measures relating to education, labor, health, and public welfare.",
        readMore: "http://www.help.senate.gov/about",
        chairman: {
            title: "chairman",
            name: "Lamar Alexander",
            state: "TN",
            party: "Republican",
            partyCode: "r",
            twitterHandle: "@SenAlexander",
            phone: "(202) 224-4944",
            onTheIssues: "http://www.ontheissues.org/Senate/Lamar_Alexander.htm"
        }
    }, {
        type: "subcommitee",
        committeeName: "Children and Families",
        objective: "Head Start, the Family Medical Leave Act, child care and child support, and other issues involving children, youth, and families",
        readMore: "",
        chairman: {
            title: "sub-committee chairman",
            name: "Rand Paul",
            state: "KY",
            party: "Republican",
            partyCode: "r",
            twitterHandle: "@RandPaul",
            phone: "(202) 224-4343",
            onTheIssues: "http://www.ontheissues.org/Senate/Rand_Paul.htm"
        },
    }, {
        type: "subcommitee",
        committeeName: "United States Senate Health Subcommittee on Employment and Workplace Safety",
        objective: "Workforce education and training, worker health and safety, wage and hour laws, and workplace flexibility",
        readMore: "",
        chairman: {
            title: "sub-committee chairman",
            name: "Johnny Isakson",
            state: "GA",
            party: "Republican",
            partyCode: "r",
            twitterHandle: "@SenatorIsakson",
            phone: "(770) 818-1493",
            onTheIssues: "http://www.ontheissues.org/Senate/Johnny_Isakson.htm"
        }
    }]

    committees.appropriations = [{
        type: "committee",
        committeeName: "Appropriations",
        objective: "Jurisdiction over all discretionary spending legislation in the Senate.",
        readMore: "http://www.appropriations.senate.gov/about/chairman",
        chairman: {
            title: "chairman",
            name: "Thad Cochran",
            state: "MS",
            party: "Republican",
            partyCode: "r",
            twitterHandle: "@SenThadCochran",
            phone: "(202) 224-5054",
            onTheIssues: "http://www.ontheissues.org/Senate/Thad_Cochran.htm"
        }
    }, {
        type: "subcommitee",
        committeeName: "Subcommittee on Labor, Health and Human Services, Education, and Related Agencies",
        objective: "This subcommittee oversees funding for the Departments of Education, Health and Human Services, and Labor. Certain agencies within Health and Human Services are handled by separate subcommittees, such as the Indian Health Service (Interior Subcommittee) and the Food and Drug Administration (Agriculture Subcommittee).",
        readMore: "http://www.appropriations.senate.gov/subcommittees/labor-health-and-human-services-education-and-related-agencies",
        chairman: {
            type: "commitee",
            name: "Roy Blunt",
            state: "MO",
            party: "Republican",
            partyCode: "r",
            twitterHandle: "@RoyBlunt",
            phone: "(202) 224-5721",
            onTheIssues: "http://www.ontheissues.org/House/Roy_Blunt.htm"
        }
    }]

    return committees
})
