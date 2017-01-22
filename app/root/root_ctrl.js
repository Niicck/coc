var app = angular.module('app');

app.controller('rootController', function($scope, $rootScope, $window, rootServices, houseCommittees, senateCommittees, senateServices, houseServices) {

    $scope.houseCommittees = houseCommittees.committees;

    $scope.senateCommittees = senateCommittees.committees;

    if ($window.localStorage["countoncongress-userSignedIn"]) {
        $scope.userData = $rootScope.twitterData;
    }

    $scope.selectHouse = function() {
        $scope.houseSelected = true;
        $scope.senateSelected = false;
        $scope.houseSelectedClass = "btn-primary";
        $scope.senateSelectedClass = "btn-default";
        $scope.committeeDataSelected = "houseCommittees"
    }

    $scope.selectSenate = function() {
        $scope.houseSelected = false;
        $scope.senateSelected = true;
        $scope.houseSelectedClass = "btn-default";
        $scope.senateSelectedClass = "btn-primary";
    }

    $scope.selectHouse()

    var getTwitterData = function() {
        rootServices.userData()
            .then(function(twitterData) {
                $rootScope.twitterData = twitterData.data.twitterData;
            })
    }

    $scope.loginToTwitter = function() {
        rootServices.loginToTwitter()
            .then(function(response) {
                if (response.data.requestToken) {
                    $window.location.href = 'https://www.twitter.com/oauth/authenticate?oauth_token=' + response.data.requestToken
                } else {
                    getTwitterData();
                }
            })
    }

    $scope.sendTweet = function(message, twitterHandle, position, chamber, index) {
        rootServices.sendTweet(message)
            .then(function(result) {
                if (chamber === "house") {
                    $scope.houseCommittees[index][position].message = '@' + $scope.houseCommittees[index][position].twitter_account + " "
                }
                if (chamber === "senate") {
                    $scope.senateCommittees[index][position].message = '@' + $scope.senateCommittees[index][position].twitter_account + " "
                }

                $scope.alert.addAlert('Tweet Sent to @' + twitterHandle, 'success');
            })
            .catch(function(result) {
                console.log("+++ 64 root_ctrl.js result: ", result)
                var response = JSON.parse(result.data.data)
                $scope.alert.addAlert(response.errors[0].message, 'danger');
            })
    }

    $scope.logout = function() {
        function onYes() {
            rootServices.logout()
                .then(function(result) {
                    if (result.status) {
                        delete $rootScope.twitterData;
                        $scope.userData = {};
                        $scope.userData.signedIn = false;
                        window.localStorage.setItem('countoncongress-username', null);
                        window.localStorage.setItem('countoncongress-userSignedIn', false);
                    }
                })
        }
        $scope.confirm.initialize('Are you sure you want to logout?', onYes);
    }

    getTwitterData();
// THIS CODE BELOW PULLS CONGRESS' COMMISSIONS AND MEMBERS DATA FROM PROPUBLICA AND MERGES IT PER HOUSE. TO RUN IT: UN COMMENT matchHouse() OR matchSenate() AND LOAD THE PAGE. THE MERGED DATA WILL SHOW UP ON THE CONSOLE.

$scope.senate = senateServices;
$scope.house = houseServices;


// $scope.matchedHouse = [];
// $scope.matchedSenate = [];

// var matchHouse = function() {
//     _.forEach($scope.house.committees[0].committees, function(committee) {

//         var matchedData = {
//             committee: committee,
//             chair: null,
//             ranking_member: null

//         };

//         _.forEach($scope.house.members[0].members, function(member) {
//             if (member.id === committee.chair_id) {
//                 matchedData.chair = member;
//             }
//             if (member.id === committee.ranking_member_id) {
//                 matchedData.ranking_member = member;
//             }

//         })
//         $scope.matchedHouse.push(matchedData)
//     })
//     console.log("+++ 30 root_ctrl.js $scope.matchedHouse: ", JSON.stringify($scope.matchedHouse, null, "\t"));
// }



// var matchSenate = function() {
//     _.forEach($scope.senate.committees[0].committees, function(committee) {

//         var matchedData = {
//             committee: committee,
//             chair: null
//         };

//         _.forEach($scope.senate.members[0].members, function(member) {
//             if (member.id === committee.chair_id) {
//                 matchedData.chair = member;
//                 matchedData.chair.message = "@" + member.twitter_account + " ";
//             }
//             if (member.id === committee.ranking_member_id) {
//                 matchedData.ranking_member = member;
//                 matchedData.ranking_member.message = "@" + member.twitter_account + " ";
//             }
//         })
//         $scope.matchedSenate.push(matchedData)
//     })
//     console.log("+++ 30 root_ctrl.js $scope.matchedSenate: ", JSON.stringify($scope.matchedSenate, null, "\t"));
// }

// // matchHouse();
// matchSenate();



    var houseMembersCalculation = function() {
        $scope.houseMissedPercentAvg = 0;
        var houseMissedNumber = 0;

        $scope.houseVotesWithPartyAvg = 0;
        var housePartyNumber = 0;

        _.forEach($scope.house.members[0].members, function(member) {
            if(member.missed_votes_pct){
                $scope.houseMissedPercentAvg = (parseFloat(member.missed_votes_pct)) + $scope.houseMissedPercentAvg;
                houseMissedNumber++;
            }

            if(member.votes_with_party_pct){
                $scope.houseVotesWithPartyAvg = (parseFloat(member.votes_with_party_pct)) + $scope.houseVotesWithPartyAvg;
                housePartyNumber++;
            }
        })
        $scope.houseMissedPercentAvg = $scope.houseMissedPercentAvg/houseMissedNumber;
        $scope.houseVotesWithPartyAvg = $scope.houseVotesWithPartyAvg/housePartyNumber;

        $scope.houseMissedPercentAvg = Math.round($scope.houseMissedPercentAvg * 100) / 100
        $scope.houseVotesWithPartyAvg = Math.round($scope.houseVotesWithPartyAvg * 100) / 100
        console.log("+++ 170 root_ctrl.js $scope.houseMissedPercentAvg: ", $scope.houseMissedPercentAvg)
        console.log("+++ 171 root_ctrl.js $scope.houseVotesWithPartyAvg: ", $scope.houseVotesWithPartyAvg)
    }

    var senateMembersCalculation = function() {
        $scope.senateMissedPercentAvg = 0;
        var senateMissedNumber = 0;

        $scope.senateVotesWithPartyAvg = 0;
        var senatePartyNumber = 0;

        _.forEach($scope.senate.members[0].members, function(member) {
            if(member.missed_votes_pct){
                $scope.senateMissedPercentAvg = (parseFloat(member.missed_votes_pct)) + $scope.senateMissedPercentAvg;
                senateMissedNumber++;
            }

            if(member.votes_with_party_pct){
                $scope.senateVotesWithPartyAvg = (parseFloat(member.votes_with_party_pct)) + $scope.senateVotesWithPartyAvg;
                senatePartyNumber++;
            }
        })
        $scope.senateMissedPercentAvg = $scope.senateMissedPercentAvg/senateMissedNumber;
        $scope.senateVotesWithPartyAvg = $scope.senateVotesWithPartyAvg/senatePartyNumber;

        $scope.senateMissedPercentAvg = Math.round($scope.senateMissedPercentAvg * 100) / 100
        $scope.senateVotesWithPartyAvg = Math.round($scope.senateVotesWithPartyAvg * 100) / 100
        console.log("+++ 197 root_ctrl.js $scope.senateMissedPercentAvg: ", $scope.senateMissedPercentAvg)
        console.log("+++ 198 root_ctrl.js $scope.senateVotesWithPartyAvg: ", $scope.senateVotesWithPartyAvg)
    }

    houseMembersCalculation();
    senateMembersCalculation();
});

