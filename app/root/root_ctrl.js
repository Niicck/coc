var app = angular.module('app');

app.controller('rootController', function($scope, $rootScope, $window, rootServices, houseCommittees, senateCommittees, senateServices, houseServices) {

    $scope.senate = senateServices;
    $scope.house = houseServices;

    if ($window.localStorage["countoncongress-userSignedIn"]) {
        $scope.userData = $rootScope.twitterData;
    }

    $scope.selectHouse = function() {
        $scope.committeesSelectedData = houseCommittees.committees;

        $scope.houseSelected = true;
        $scope.senateSelected = false;
        $scope.houseSelectedClass = "btn-primary";
        $scope.senateSelectedClass = "btn-default";
        $scope.commSection = 0;
    }

    $scope.selectSenate = function() {
        $scope.committeesSelectedData = senateCommittees.committees;

        $scope.houseSelected = false;
        $scope.senateSelected = true;
        $scope.houseSelectedClass = "btn-default";
        $scope.senateSelectedClass = "btn-primary";
        $scope.commSection = 0;
    }

    $scope.selectHouse();

    $scope.toggleCommSection = function(index) {
        if ($scope.commSection === index) {
            $scope.commSection = null;
        }else{
            $scope.commSection = index;
        };
    }

    $scope.toggleDescription = function(index) {
        console.log("+++ 39 root_ctrl.js toggleDescription")
    }





    var getTwitterData = function() {
        rootServices.userData()
            .then(function(twitterData) {
                $scope.userData = twitterData.data.twitterData;
            })
    }


    $scope.sendTweet = function(message, twitterHandle, position, index) {
        rootServices.sendTweet(message)
            .then(function(result) {
                $scope.committeesSelectedData[index][position].message = '@' + $scope.committeesSelectedData[index][position].twitter_account + " "
                $scope.alert.addAlert('Tweet Sent to @' + twitterHandle, 'success');
            })
            .catch(function(result) {
                console.log("+++ 64 root_ctrl.js result: ", result)
                var response = JSON.parse(result.data.data)
                $scope.alert.addAlert(response.errors[0].message, 'danger');
            })
    }

    getTwitterData();

    var houseMembersCalculation = function() {
        $scope.houseMissedPercentAvg = 0;
        var houseMissedNumber = 0;

        $scope.houseVotesWithPartyAvg = 0;
        var housePartyNumber = 0;

        _.forEach($scope.house.members[0].members, function(member) {
            if (member.missed_votes_pct) {
                $scope.houseMissedPercentAvg = (parseFloat(member.missed_votes_pct)) + $scope.houseMissedPercentAvg;
                houseMissedNumber++;
            }

            if (member.votes_with_party_pct) {
                $scope.houseVotesWithPartyAvg = (parseFloat(member.votes_with_party_pct)) + $scope.houseVotesWithPartyAvg;
                housePartyNumber++;
            }
        })
        $scope.houseMissedPercentAvg = $scope.houseMissedPercentAvg / houseMissedNumber;
        $scope.houseVotesWithPartyAvg = $scope.houseVotesWithPartyAvg / housePartyNumber;

        $scope.houseMissedPercentAvg = Math.round($scope.houseMissedPercentAvg * 100) / 100
        $scope.houseVotesWithPartyAvg = Math.round($scope.houseVotesWithPartyAvg * 100) / 100
    }

    var senateMembersCalculation = function() {
        $scope.senateMissedPercentAvg = 0;
        var senateMissedNumber = 0;

        $scope.senateVotesWithPartyAvg = 0;
        var senatePartyNumber = 0;

        _.forEach($scope.senate.members[0].members, function(member) {
            if (member.missed_votes_pct) {
                $scope.senateMissedPercentAvg = (parseFloat(member.missed_votes_pct)) + $scope.senateMissedPercentAvg;
                senateMissedNumber++;
            }

            if (member.votes_with_party_pct) {
                $scope.senateVotesWithPartyAvg = (parseFloat(member.votes_with_party_pct)) + $scope.senateVotesWithPartyAvg;
                senatePartyNumber++;
            }
        })
        $scope.senateMissedPercentAvg = $scope.senateMissedPercentAvg / senateMissedNumber;
        $scope.senateVotesWithPartyAvg = $scope.senateVotesWithPartyAvg / senatePartyNumber;

        $scope.senateMissedPercentAvg = Math.round($scope.senateMissedPercentAvg * 100) / 100
        $scope.senateVotesWithPartyAvg = Math.round($scope.senateVotesWithPartyAvg * 100) / 100
    }

    houseMembersCalculation();
    senateMembersCalculation();


    // THIS CODE BELOW PULLS CONGRESS' COMMISSIONS AND MEMBERS DATA FROM PROPUBLICA AND MERGES IT PER HOUSE. TO RUN IT: UN COMMENT matchHouse() OR matchSenate() AND LOAD THE PAGE. THE MERGED DATA WILL SHOW UP ON THE CONSOLE.

    $scope.matchedChamber = [];

    var matchCommWithMembers = function(chamber) {
        _.forEach(chamber.committees[0].committees, function(committee) {

            var matchedData = {
                committee: committee,
                chair: null,
                ranking_member: null

            };

            _.forEach(chamber.members[0].members, function(member) {
                if (member.id === committee.chair_id) {
                    matchedData.chair = member;
                    matchedData.chair.message = "@" + member.twitter_account + " ";
                }
                if (member.id === committee.ranking_member_id) {
                    matchedData.ranking_member = member;
                    matchedData.ranking_member.message = "@" + member.twitter_account + " ";
                }

            })
            $scope.matchedChamber.push(matchedData)
        })
        console.log("+++ 163 root_ctrl.js chamber: ", chamber.committees[0].chamber)
        console.log("+++ 30 root_ctrl.js $scope.matchedChamber: ", JSON.stringify($scope.matchedChamber, null, "\t"));
    }


    //ONLY RUN THESE WHEN YOU WANT HAVE GATHERED THE NEW CONGRESS DATA FROM PROPUBLICA 
    // matchCommWithMembers($scope.house);
    // matchCommWithMembers($scope.senate);

    //END OF MATCHING CODE
});
