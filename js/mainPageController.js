var app = angular.module('IPCalculator', ['ngRoute', 'ngMaterial', 'ngMdIcons']);

app.factory('Converting', function(){

	var factory = {};

	factory.binToDec = function( bin ){
		return parseInt(bin, 2);
	}

	factory.binToHex = function( bin ){
		return parseInt(bin, 2).toString(16);
	}

	factory.decToBin = function( dec ){
		return parseInt(dec, 10).toString(2);
	}

	factory.decToHex = function( dec ){
		return dec.toString(16);
	}

	factory.bitNegation = function( input ){
		var output = "";
		output = input.replace("1", "0");
		output = input.replace("0", "1");
		return output;
	}

	return factory;

});

app.controller('mainPage', ['$scope', '$mdSidenav', '$mdMedia', 'Converting', function($scope, $mdSidenav, $mdMedia, Converting){

	$scope.toggleSideNav = function() {
        if(!$mdMedia('gt-md'))
            $mdSidenav('left').toggle();
    };

  	$scope.titleName = "Internet Protocol Calculator";
	$scope.menu = [
	    {
	      link : '#/address',
	      title: 'IPv4 Address Analyzer',
	      icon: 'network_check'
	    },
	    {
	      link : '#/range',
	      title: 'IPv4 Range to Prefix Converter',
	      icon: 'cast'
	    },
	    {
	      link : '#/subnet',
	      title: 'IPv4 Subnet Calculator',
	      icon: 'device_hub'
	    },
	    {
	      link : '#/about',
	      title: 'About',
	      icon: 'info_outline'
	    }
	];

	$scope.outputTable = [
		{
			title: 'Address range:',
			value: ''
		},
		{
			title: 'Number of subnets:',
			value: ''
		},
		{
			title: 'Number of hosts:',
			value: ''
		},
		{
			title: 'Including net/broadcast:',
			value: ''
		},
		{
			title: 'Network address:',
			value: ''
		},
		{
			title: 'Broadcast address:',
			value: ''
		}
	];

	$scope.outputTableBinary = [
		{
			title: 'IP address:',
			value: ''
		},
		{
			title: 'Network mask:',
			value: ''
		},
		{
			title: 'Network address:',
			value: ''
		},
		{
			title: 'Broadcast address:',
			value: ''
		}
	];

	$scope.outputTableHexa = [
		{
			title: 'IP address:',
			value: ''
		},
		{
			title: 'Network mask:',
			value: ''
		},
		{
			title: 'Network address:',
			value: ''
		},
		{
			title: 'Broadcast address:',
			value: ''
		}
	];

	$scope.addressInputs = {
		ipAddress: "",
		networkMask: "",
		prefixLength: ""
	};

	$scope.addressInputsRange = {
		ipAddressFrom: "",
		ipAddressTo: ""
	};

	$scope.prefixesLength = [];
	for (var i = 1; i <= 30; i++){
		$scope.prefixesLength.push(i);
	}

	$scope.calculate = function(){

		var subnetMaskString = [];
		var inputIpAddress = [];
		var outputIpAddress = [];
		var broadcastIpAddress = [];
		var sizeOfBlock = 0, countOfZeros = 0, indexOfLastByte = 0, lastNumberOfBroadcast = 0;
		var numberOfHosts = 0;

		inputIpAddress = $scope.addressInputs.ipAddress.split(".");
		outputIpAddress = $scope.addressInputs.ipAddress.split(".");
		broadcastIpAddress = $scope.addressInputs.ipAddress.split(".");

		subnetMaskString[0] = "";
		subnetMaskString[1] = "";
		subnetMaskString[2] = "";
		subnetMaskString[3] = "";
		
		if (inputIpAddress.length != 4){
			return;
		}
		for (var i = 0, j = 1, index = 0; i < parseInt($scope.addressInputs.prefixLength); i++, j++){
			if (j <= 8){
				subnetMaskString[index] += "1";
				if (j == 8){
					j = 0;
					index++;
				}
			}
		}
		// getMaskRange

		for (var i = 0; i < 4; i++){
			if (subnetMaskString[i] == "")
				subnetMaskString[i] = "00000000";
			else if (subnetMaskString[i] == "1")
				subnetMaskString[i] = "10000000";
			else if (subnetMaskString[i] == "11")
				subnetMaskString[i] = "11000000";
			else if (subnetMaskString[i] == "111")
				subnetMaskString[i] = "11100000";
			else if (subnetMaskString[i] == "1111")
				subnetMaskString[i] = "11110000";
			else if (subnetMaskString[i] == "11111")
				subnetMaskString[i] = "11111000";
			else if (subnetMaskString[i] == "111111")
				subnetMaskString[i] = "11111100";
			else if (subnetMaskString[i] == "1111111")
				subnetMaskString[i] = "11111110";
		}

		for (var i = 0; i < 4; i++){
			var tmpSubnet = Converting.binToDec(subnetMaskString[i]);
			outputIpAddress[i] = inputIpAddress[i] & tmpSubnet;
			broadcastIpAddress[i] = inputIpAddress[i] | (~tmpSubnet & 0xff);
		}

		$scope.addressInputs.networkMask = Converting.binToDec(subnetMaskString[0])+"."+Converting.binToDec(subnetMaskString[1])+"."+Converting.binToDec(subnetMaskString[2])+"."+Converting.binToDec(subnetMaskString[3]);

		for (var i = 0; i < 4; i++){
			subnetMaskString[i] = Converting.binToDec(subnetMaskString[i]);
		}

		var tmpNumber = 32 - parseInt($scope.addressInputs.prefixLength);
		numberOfHosts = Math.pow(2, tmpNumber) - 2;

		$scope.outputTable[0].value = outputIpAddress[0]+"."+outputIpAddress[1]+"."+outputIpAddress[2]+"."+outputIpAddress[3]+" - "+broadcastIpAddress[0]+"."+broadcastIpAddress[1]+"."+broadcastIpAddress[2]+"."+broadcastIpAddress[3];
		$scope.outputTable[1].value = Math.pow(2, $scope.addressInputs.prefixLength);
		$scope.outputTable[2].value = numberOfHosts;
		$scope.outputTable[3].value = numberOfHosts + 2;
		$scope.outputTable[4].value = outputIpAddress[0]+"."+outputIpAddress[1]+"."+outputIpAddress[2]+"."+outputIpAddress[3];
		$scope.outputTable[5].value = broadcastIpAddress[0]+"."+broadcastIpAddress[1]+"."+broadcastIpAddress[2]+"."+broadcastIpAddress[3];

		$scope.outputTableBinary[0].value = Converting.decToBin(outputIpAddress[0])+" . "+Converting.decToBin(outputIpAddress[1])+" . "+Converting.decToBin(outputIpAddress[2])+" . "+Converting.decToBin(outputIpAddress[3]);
		$scope.outputTableBinary[1].value = Converting.decToBin(subnetMaskString[0])+" . "+Converting.decToBin(subnetMaskString[1])+" . "+Converting.decToBin(subnetMaskString[2])+" . "+Converting.decToBin(subnetMaskString[3]);
		$scope.outputTableBinary[2].value = Converting.decToBin(outputIpAddress[0])+" . "+Converting.decToBin(outputIpAddress[1])+" . "+Converting.decToBin(outputIpAddress[2])+" . "+Converting.decToBin(outputIpAddress[3]);
		$scope.outputTableBinary[3].value = Converting.decToBin(broadcastIpAddress[0])+" . "+Converting.decToBin(broadcastIpAddress[1])+" . "+Converting.decToBin(broadcastIpAddress[2])+" . "+Converting.decToBin(broadcastIpAddress[3]);

		$scope.outputTableHexa[0].value = (Converting.decToHex(outputIpAddress[0])+" . "+Converting.decToHex(outputIpAddress[1])+" . "+Converting.decToHex(outputIpAddress[2])+" . "+Converting.decToHex(outputIpAddress[3])).toUpperCase();
		$scope.outputTableHexa[1].value = (Converting.decToHex(subnetMaskString[0])+" . "+Converting.decToHex(subnetMaskString[1])+" . "+Converting.decToHex(subnetMaskString[2])+" . "+Converting.decToHex(subnetMaskString[3])).toUpperCase();
		$scope.outputTableHexa[2].value = (Converting.decToHex(outputIpAddress[0])+" . "+Converting.decToHex(outputIpAddress[1])+" . "+Converting.decToHex(outputIpAddress[2])+" . "+Converting.decToHex(outputIpAddress[3])).toUpperCase();
		$scope.outputTableHexa[3].value = (Converting.decToHex(broadcastIpAddress[0])+" . "+Converting.decToHex(broadcastIpAddress[1])+" . "+Converting.decToHex(broadcastIpAddress[2])+" . "+Converting.decToHex(broadcastIpAddress[3])).toUpperCase();
	}

	$scope.rangeData = [];
	$scope.calculateRange = function(){
		$scope.rangeData = IpSubnetCalculator.calculate( $scope.addressInputsRange.ipAddressFrom, $scope.addressInputsRange.ipAddressTo );
		console.log($scope.rangeData );
	}
	
}]).config(function($routeProvider, $routeProvider, $locationProvider) {

	$locationProvider.hashPrefix('');
	$routeProvider
    .when("/", {
        templateUrl : "templates/address.html"
    })
    .when("/address", {
        templateUrl : "templates/address.html"
    })
    .when("/range", {
        templateUrl : "templates/range.html"
    })
    .when("/subnet", {
        templateUrl : "templates/subnet.html"
    })
    .when("/about", {
        templateUrl : "templates/about.html"
    }).otherwise({ redirectTo: '/' });

});