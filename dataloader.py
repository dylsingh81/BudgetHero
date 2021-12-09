import argparse
import json
import csv


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--load_path", help="Directory to load JSON", 
        default="./users.json")
    parser.add_argument("--output_path", help="Directory to save CSV", default="./databaseOutput.csv")
    args, _ = parser.parse_known_args()
    return args


if __name__ == "__main__":

    args = parse_args()
    print(vars(args))


    data = json.load(open(args.load_path))

    headerPrint = ["User ID", "Order",
        "Bin(0) Economic assistance to needy people around the world",
        "Bin(1) Economic assistance to needy people in the U.S.",
        "Bin(2) Anti-terrorism defenses in the U.S.",
        "Bin(3) Health care",
        "Bin(4) Rebuilding highways, bridges and roads",
        "Bin(5) Environmental protection",
        "Bin(6) Medicare",
        "Bin(7) Education",
        "Bin(8) Government assistance for the unemployed",
        "Bin(9) Scientific research",
        "Bin(10) Military defense",
        "Bin(11) Social Security",
        "Bin(12) Veterans benefits and services",

        "Survey(0) Economic assistance to needy people around the world",
        "Survey(1) Economic assistance to needy people in the U.S.",
        "Survey(2) Anti-terrorism defenses in the U.S.",
        "Survey(3) Health care",
        "Survey(4) Rebuilding highways, bridges and roads",
        "Survey(5) Environmental protection",
        "Survey(6) Medicare",
        "Survey(7) Education",
        "Survey(8) Government assistance for the unemployed",
        "Survey(9) Scientific research",
        "Survey(10) Military defense",
        "Survey(11) Social Security",
        "Survey(12) Veterans benefits and services"]

    fieldNames = ["user_id", "order", "bin_0", "bin_1", "bin_2", "bin_3", "bin_4", "bin_5", "bin_6", "bin_7", "bin_8", "bin_9", "bin_10", "bin_11", "bin_12", "survey_0", "survey_1", "survey_2", "survey_3", "survey_4", "survey_5", "survey_6", "survey_7", "survey_8", "survey_9", "survey_10", "survey_11", "survey_12"]

    rows = []

    for i in range(len(data)):
        #Output Dictionary - blanks of field names
        outputDict = {}
        for field in fieldNames:
            outputDict[field] = ""

        #Get Data ID
        outputDict["user_id"] = data[i]["cookie_id"]
        #Get Data Order
        if (data[i]["first"] == "survey"):
            outputDict["order"] = 0
        else:
            outputDict["order"] = 1
        #Get Game 1 Data
        #print("Row:", i, ". ID:", data[i]["cookie_id"])
        if(data[i]["gameData"] != {}):
            
            # Create dict matching id to total coins
            coins = {}

            for game in data[i]["gameData"]:
                #print(game)
                # Check if game exists
                if(data[i]["gameData"][game] == {}):
                    #gameCoinAmounts.append(-1)
                    continue
                gameData = data[i]["gameData"][game]["indvGameData"]

                lastLevel = gameData["lastLevel"]  
                if lastLevel < 10:
                    levelName = "level-0" + str(lastLevel)
                else:
                    levelName = "level-" + str(lastLevel)
                
                bins = gameData[levelName]["currentBins"]
                
                # Create pairing between game number and coin amount
                coins[game] = (sum(bins))

            # Get max key of coins
            if(coins != {}):
                maxKey = max(coins, key=coins.get)
            else:
                maxKey = -1
            gamePlayedNum = data[i]["game_played_num"]
            #print(maxKey, gamePlayedNum, coins)

            gnum = maxKey # "game-" + str(gamePlayedNum)
            #print(data[i]["gameData"][gnum])
            if(maxKey == -1):
                continue

            if (data[i]["gameData"][gnum] == {}):
                print("No data for game " + str(gamePlayedNum))
                continue



            game1 = data[i]["gameData"][gnum]["indvGameData"]
            #Get Bin Data
            lastLevel = game1["lastLevel"]  
            if lastLevel < 10:
                levelName = "level-0" + str(lastLevel)
            else:
                levelName = "level-" + str(lastLevel)
            for j in range(len(game1[levelName]["currentBins"])):
                outputDict["bin_" + str(j)] = game1[levelName]["currentBins"][j]
    
        #Get Survey 1 Data
        if(data[i]["surveyData"] != {}):
            survey1 = data[i]["surveyData"]["survey-1"]
            for i, value in enumerate(survey1.values()):
                outputDict["survey_" + str(i)] = value

        rows.append(outputDict)

    with open(args.output_path, 'w', encoding='UTF8' , newline='') as f:
        writerHeader = csv.writer(f)
        writerHeader.writerow(headerPrint)

        writer = csv.DictWriter(f, fieldnames=fieldNames)
        #writer.writeheader()
        writer.writerows(rows)

