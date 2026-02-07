#!/usr/bin/env python3
"""
Script om alle goals en OKRs uit de database te halen, gegroepeerd per life domain.
Gebruik: python scripts/get_goals_and_okrs.py
"""

import psycopg2
import os
import sys
from collections import defaultdict

# Database configuratie (uit application.properties)
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'woi_backend_v2',
    'user': os.environ.get('USER', 'postgres'),
    'password': ''  # Leeg wachtwoord zoals in application.properties
}

def get_connection():
    """Maak database connectie"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.Error as e:
        print(f"Fout bij verbinden met database: {e}")
        sys.exit(1)

def get_all_goals_and_okrs():
    """Haal alle goals en OKRs op, gegroepeerd per life domain"""
    query = """
    SELECT 
        ld.id AS life_domain_id,
        ld.domain_key,
        ld.title_nl AS life_domain_title_nl,
        ld.title_en AS life_domain_title_en,
        ld.display_order AS life_domain_order,
        g.id AS goal_id,
        g.title_nl AS goal_title_nl,
        g.title_en AS goal_title_en,
        g.description_nl AS goal_description_nl,
        g.description_en AS goal_description_en,
        g.order_index AS goal_order,
        o.id AS objective_id,
        o.title_nl AS objective_title_nl,
        o.title_en AS objective_title_en,
        o.description_nl AS objective_description_nl,
        o.description_en AS objective_description_en,
        o.order_index AS objective_order,
        kr.id AS key_result_id,
        kr.title_nl AS key_result_title_nl,
        kr.title_en AS key_result_title_en,
        kr.description_nl AS key_result_description_nl,
        kr.description_en AS key_result_description_en,
        kr.target_value AS key_result_target_value,
        kr.unit AS key_result_unit,
        kr.order_index AS key_result_order
    FROM 
        goals.life_domains ld
    LEFT JOIN 
        goals_okr.goals g ON g.life_domain_id = ld.id
    LEFT JOIN 
        goals_okr.objectives o ON o.goal_id = g.id
    LEFT JOIN 
        goals_okr.key_results kr ON kr.objective_id = o.id
    ORDER BY 
        ld.display_order ASC,
        g.order_index ASC NULLS LAST,
        o.order_index ASC NULLS LAST,
        kr.order_index ASC NULLS LAST;
    """
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(query)
        rows = cur.fetchall()
        
        # Groepeer data per life domain
        domains = defaultdict(lambda: {
            'info': None,
            'goals': defaultdict(lambda: {
                'info': None,
                'objectives': defaultdict(lambda: {
                    'info': None,
                    'key_results': []
                })
            })
        })
        
        for row in rows:
            (ld_id, ld_key, ld_title_nl, ld_title_en, ld_order,
             g_id, g_title_nl, g_title_en, g_desc_nl, g_desc_en, g_order,
             o_id, o_title_nl, o_title_en, o_desc_nl, o_desc_en, o_order,
             kr_id, kr_title_nl, kr_title_en, kr_desc_nl, kr_desc_en, kr_target, kr_unit, kr_order) = row
            
            # Life domain info
            if ld_id and domains[ld_id]['info'] is None:
                domains[ld_id]['info'] = {
                    'id': ld_id,
                    'key': ld_key,
                    'title_nl': ld_title_nl,
                    'title_en': ld_title_en,
                    'order': ld_order
                }
            
            # Goal info
            if g_id:
                if domains[ld_id]['goals'][g_id]['info'] is None:
                    domains[ld_id]['goals'][g_id]['info'] = {
                        'id': g_id,
                        'title_nl': g_title_nl,
                        'title_en': g_title_en,
                        'description_nl': g_desc_nl,
                        'description_en': g_desc_en,
                        'order': g_order
                    }
                
                # Objective info
                if o_id:
                    if domains[ld_id]['goals'][g_id]['objectives'][o_id]['info'] is None:
                        domains[ld_id]['goals'][g_id]['objectives'][o_id]['info'] = {
                            'id': o_id,
                            'title_nl': o_title_nl,
                            'title_en': o_title_en,
                            'description_nl': o_desc_nl,
                            'description_en': o_desc_en,
                            'order': o_order
                        }
                    
                    # Key result
                    if kr_id:
                        kr_info = {
                            'id': kr_id,
                            'title_nl': kr_title_nl,
                            'title_en': kr_title_en,
                            'description_nl': kr_desc_nl,
                            'description_en': kr_desc_en,
                            'target_value': kr_target,
                            'unit': kr_unit,
                            'order': kr_order
                        }
                        domains[ld_id]['goals'][g_id]['objectives'][o_id]['key_results'].append(kr_info)
        
        return domains
        
    finally:
        conn.close()

def print_results(domains):
    """Print de resultaten in een leesbaar formaat"""
    print("=" * 80)
    print("GOALS EN OKRs GEGROEPEERD PER LIFE DOMAIN")
    print("=" * 80)
    print()
    
    # Sorteer life domains op display_order
    sorted_domains = sorted(domains.items(), key=lambda x: x[1]['info']['order'] if x[1]['info'] else 999)
    
    for ld_id, domain_data in sorted_domains:
        if domain_data['info'] is None:
            continue
            
        ld = domain_data['info']
        print(f"🏛️  LIFE DOMAIN: {ld['title_nl']} ({ld['key']})")
        print(f"   ID: {ld['id']} | Order: {ld['order']}")
        print()
        
        if not domain_data['goals']:
            print("   ⚠️  Geen goals gevonden voor dit life domain")
            print()
            continue
        
        # Sorteer goals op order_index
        sorted_goals = sorted(domain_data['goals'].items(), 
                            key=lambda x: x[1]['info']['order'] if x[1]['info'] else 999)
        
        for g_id, goal_data in sorted_goals:
            if goal_data['info'] is None:
                continue
                
            g = goal_data['info']
            print(f"   📌 GOAL {g['order']}: {g['title_nl']}")
            if g['description_nl']:
                print(f"      Beschrijving: {g['description_nl']}")
            print(f"      ID: {g['id']}")
            print()
            
            if not goal_data['objectives']:
                print("      ⚠️  Geen objectives gevonden voor dit goal")
                print()
                continue
            
            # Sorteer objectives op order_index
            sorted_objectives = sorted(goal_data['objectives'].items(),
                                     key=lambda x: x[1]['info']['order'] if x[1]['info'] else 999)
            
            for o_id, obj_data in sorted_objectives:
                if obj_data['info'] is None:
                    continue
                    
                o = obj_data['info']
                print(f"      🎯 OBJECTIVE {o['order']}: {o['title_nl']}")
                if o['description_nl']:
                    print(f"         Beschrijving: {o['description_nl']}")
                print(f"         ID: {o['id']}")
                print()
                
                if not obj_data['key_results']:
                    print("         ⚠️  Geen key results gevonden voor dit objective")
                    print()
                    continue
                
                # Sorteer key results op order_index
                sorted_krs = sorted(obj_data['key_results'], key=lambda x: x['order'])
                
                for kr in sorted_krs:
                    print(f"         ✅ KEY RESULT {kr['order']}: {kr['title_nl']}")
                    if kr['description_nl']:
                        print(f"            Beschrijving: {kr['description_nl']}")
                    print(f"            Target: {kr['target_value']} {kr['unit']}")
                    print(f"            ID: {kr['id']}")
                    print()
        
        print("-" * 80)
        print()

def print_summary(domains):
    """Print een samenvatting"""
    print("=" * 80)
    print("SAMENVATTING")
    print("=" * 80)
    print()
    
    total_goals = 0
    total_objectives = 0
    total_key_results = 0
    
    sorted_domains = sorted(domains.items(), key=lambda x: x[1]['info']['order'] if x[1]['info'] else 999)
    
    for ld_id, domain_data in sorted_domains:
        if domain_data['info'] is None:
            continue
            
        ld = domain_data['info']
        num_goals = len(domain_data['goals'])
        num_objectives = sum(len(g['objectives']) for g in domain_data['goals'].values())
        num_key_results = sum(
            len(o['key_results']) 
            for g in domain_data['goals'].values() 
            for o in g['objectives'].values()
        )
        
        total_goals += num_goals
        total_objectives += num_objectives
        total_key_results += num_key_results
        
        print(f"{ld['title_nl']:30} | Goals: {num_goals:3} | Objectives: {num_objectives:3} | Key Results: {num_key_results:3}")
    
    print("-" * 80)
    print(f"{'TOTAAL':30} | Goals: {total_goals:3} | Objectives: {total_objectives:3} | Key Results: {total_key_results:3}")
    print()

if __name__ == '__main__':
    print("Ophalen van goals en OKRs uit de database...")
    print()
    
    try:
        domains = get_all_goals_and_okrs()
        print_results(domains)
        print_summary(domains)
    except Exception as e:
        print(f"Fout: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
