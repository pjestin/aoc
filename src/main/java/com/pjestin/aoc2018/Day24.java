package com.pjestin.aoc2018;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Day24 {
  private static final String ARMY_GROUP_PATTERN = "^(\\d+) units each with (\\d+) hit points (\\(((weak|immune) to (([\\w\\s,])*))(; (weak|immune) to (([\\w\\s,])*))?\\) )?with an attack that does (\\d+) (\\w+) damage at initiative (\\d+)$";
  private static final String IMMUNE_SYSTEM = "Immune System:";
  private static final String INFECTION = "Infection:";
  private static final String IMMUNE = "immune";

  private static class Group {
    int nbUnits;
    int hitPoints;
    Set<String> immunities;
    Set<String> weaknesses;
    int attackDamage;
    String damageType;
    int initiative;
    boolean isInfection;
    Group target = null;
    Group targetedBy = null;

    public Group(int nbUnits, int hitPoints, Set<String> immunities, Set<String> weaknesses, int attackDamage,
        String damageType, int initiative, boolean isInfection) {
      this.nbUnits = nbUnits;
      this.hitPoints = hitPoints;
      this.immunities = immunities;
      this.weaknesses = weaknesses;
      this.attackDamage = attackDamage;
      this.damageType = damageType;
      this.initiative = initiative;
      this.isInfection = isInfection;
    }

    public int effectivePower() {
      return this.nbUnits * this.attackDamage;
    }

    public int canDealDamage(Group enemy) {
      if (enemy.immunities.contains(this.damageType)) {
        return 0;
      }
      int baseDamage = this.effectivePower();
      if (enemy.weaknesses.contains(this.damageType)) {
        return 2 * baseDamage;
      }
      return baseDamage;
    }

    public void attack(Group enemy) {
      int potentialDamage = this.canDealDamage(enemy);
      int lostUnits = potentialDamage / enemy.hitPoints;
      enemy.nbUnits = Math.max(0, enemy.nbUnits - lostUnits);
    }

    public String toString() {
      StringBuilder weaknessesAndImmunitiesSb = new StringBuilder();
      if (!this.immunities.isEmpty()) {
        String immunitiesString = this.immunities.stream().collect(Collectors.joining(", "));
        weaknessesAndImmunitiesSb.append(String.format("immune to %s", immunitiesString));
        if (!this.weaknesses.isEmpty()) {
          weaknessesAndImmunitiesSb.append("; ");
        }
      }
      if (!this.weaknesses.isEmpty()) {
        String weaknessesString = this.weaknesses.stream().collect(Collectors.joining(", "));
        weaknessesAndImmunitiesSb.append(String.format("weak to %s", weaknessesString));
      }
      String weaknessesAndImmunities = weaknessesAndImmunitiesSb.toString();
      return String.format(
          "%d units each with %d hit points (%s) with an attack that does %d %s damage at initiative %d", this.nbUnits,
          this.hitPoints, weaknessesAndImmunities, this.attackDamage, this.damageType, this.initiative);
    }
  }

  private static class Battle {
    List<Group> immuneSystem;
    List<Group> infection;

    Battle(List<Group> immuneSystem, List<Group> infection) {
      this.immuneSystem = immuneSystem;
      this.infection = infection;
    }

    public String toString() {
      String immuneSystemString = this.immuneSystem.stream().map(group -> group.toString())
          .collect(Collectors.joining("\n"));
      String infectionString = this.infection.stream().map(group -> group.toString()).collect(Collectors.joining("\n"));
      return String.format("Immune system:\n%s\n\nInfection:\n%s", immuneSystemString, infectionString);
    }

    public boolean canFight() {
      return !this.immuneSystem.isEmpty() && !this.infection.isEmpty();
    }

    public void fight() {
      // Target selection phase
      List<Group> groups = Stream.concat(this.immuneSystem.stream(), this.infection.stream())
          .collect(Collectors.toList());
      for (Group group : groups) {
        group.target = null;
        group.targetedBy = null;
      }
      groups.sort((group1, group2) -> {
        if (group1.effectivePower() == group2.effectivePower()) {
          return group2.initiative - group1.initiative;
        } else {
          return group2.effectivePower() - group1.effectivePower();
        }
      });
      for (Group group : groups) {
        List<Group> enemyGroups = group.isInfection ? this.immuneSystem : this.infection;
        int maxDamage = 0;
        Group maxDamageGroup = null;
        for (Group enemyGroup : enemyGroups) {
          if (enemyGroup.targetedBy != null) {
            continue;
          }
          int potentialDamage = group.canDealDamage(enemyGroup);
          if (potentialDamage == 0) {
            continue;
          }
          if (potentialDamage > maxDamage || maxDamageGroup == null
              || potentialDamage == maxDamage && (enemyGroup.effectivePower() > maxDamageGroup.effectivePower()
                  || (enemyGroup.effectivePower() == maxDamageGroup.effectivePower()
                      && enemyGroup.initiative > maxDamageGroup.initiative))) {
            maxDamage = potentialDamage;
            maxDamageGroup = enemyGroup;
          }
        }
        if (maxDamageGroup != null) {
          group.target = maxDamageGroup;
          maxDamageGroup.targetedBy = group;
        }
      }

      // Attack phase
      groups.sort((group1, group2) -> group2.initiative - group1.initiative);
      for (Group group : groups) {
        if (group.target == null) {
          continue;
        }
        group.attack(group.target);
        if (group.target.nbUnits == 0) {
          if (group.target.isInfection) {
            this.infection.remove(group.target);
          } else {
            this.immuneSystem.remove(group.target);
          }
        }
      }
    }

    public int outcome() {
      return this.immuneSystem.stream().map(group -> group.nbUnits).reduce(0, Integer::sum)
          + this.infection.stream().map(group -> group.nbUnits).reduce(0, Integer::sum);
    }
  }

  private static Battle parseArmies(List<String> lines) {
    Pattern armyGroupPattern = Pattern.compile(ARMY_GROUP_PATTERN);
    List<Group> immuneSystem = new ArrayList<>();
    List<Group> infection = new ArrayList<>();
    List<Group> currentArmy = null;
    boolean isInfection = false;
    for (String line : lines) {
      if (IMMUNE_SYSTEM.equals(line)) {
        currentArmy = immuneSystem;
        isInfection = false;
      } else if (INFECTION.equals(line)) {
        currentArmy = infection;
        isInfection = true;
      } else {
        Matcher matcher = armyGroupPattern.matcher(line);
        if (matcher.find()) {
          int nbUnits = Integer.parseInt(matcher.group(1));
          int hitPoints = Integer.parseInt(matcher.group(2));
          Set<String> immunities = new HashSet<>();
          Set<String> weaknesses = new HashSet<>();
          if (matcher.group(4) != null) {
            Set<String> immunitiesOrWeaknesses = new HashSet<String>(Arrays.asList(matcher.group(6).split(", ")));
            if (IMMUNE.equals(matcher.group(5))) {
              immunities.addAll(immunitiesOrWeaknesses);
            } else {
              weaknesses.addAll(immunitiesOrWeaknesses);
            }
            if (matcher.group(8) != null) {
              Set<String> immunitiesOrWeaknesses2 = new HashSet<String>(Arrays.asList(matcher.group(10).split(", ")));
              if (IMMUNE.equals(matcher.group(9))) {
                immunities.addAll(immunitiesOrWeaknesses2);
              } else {
                weaknesses.addAll(immunitiesOrWeaknesses2);
              }
            }
          }
          int attackDamage = Integer.parseInt(matcher.group(12));
          String damageType = matcher.group(13);
          int initiative = Integer.parseInt(matcher.group(14));
          currentArmy.add(
              new Group(nbUnits, hitPoints, immunities, weaknesses, attackDamage, damageType, initiative, isInfection));
        }
      }
    }
    return new Battle(immuneSystem, infection);
  }

  public static int findBattleOutcome(List<String> lines) {
    Battle battle = parseArmies(lines);
    while (battle.canFight()) {
      battle.fight();
    }
    return battle.outcome();
  }
}
