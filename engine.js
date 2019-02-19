'use strict';

var NlpWordPos = require('wordpos');

const phrase_punct = [',', '.', '!', '?'];

const prep_list1 = ['but'];
const prep_list2 = ['and', 'or', 'nor'];
const prep_list3 = ['either', 'neither'];
const prep_list4 = ['also', 'as well', 'too'];
const prep_list5 = ['he', 'she', 'it', 'me'];

const adj_suffixes = ['able', 'ible', 'al', 'ful', 'ic', 'ive', 'less', 'ous'];
const noun_suffixes = ['al', 'ance', 'ence', 'ation', 'tion', 'sion', 'ure', 'ment', 'age', 'ing', 'ery'];
const negatives = ['not', 'don\'t', 'doesn\'t', 'haven\'t', 'hasn\'t', 'hadn\'t', 'can\'t', 'cannot', 'none', 'no', 'never', 'neither', 'wouldn\'t', 'won\'t'];

function words_stats(words) {
    let words_unique = Array.from(new Set(words));
    return words_unique.map((entry) => {
        let count = words.filter((word) => {
            return word == entry;
        }).length;
        return new Object({
            'word': entry, 'count': count,
            'prob': count / words.length
        });
    });
}

async function normalize(sentence, concepts) {
    return new Promise(async (resolve, reject) => {
        const word_ps = new NlpWordPos();

        var tokens = sentence.replace(
            new RegExp(/[.!?]/gm), '%').split(/[ %]/gm);

        var tokens = split_by_conditions(tokens,
            function (token) { return token == ''; });

        tokens = tokens.map(function (tokens) {
            return tokens.filter(function (token) { return token != ''; });
        });

        tokens = tokens.map(function (tokens) {
            return tokens.map(function (token) {
                return token.replace(/,$/gm, '');
            });
        });

        var words = sentence.split(/[ ,]/gm).map(function (word) {
            return word.replace(new RegExp(/[.!?]/gm), '');
        }).filter(function (word) {
            return word != '';
        });

        await word_ps.getPOS(sentence).then((details) => {
            var actions = Array.from(new Set(
                concepts.map(function (class_obj) {
                    return class_obj['intent']['action'];
                })));

            if (actions.length > 0) {
                details['verbs'] = actions;
            }

            var entities = Array.from(new Set(
                concepts.map(function (class_obj) {
                    return class_obj['intent']['ent'];
                })));

            if (entities.length > 0) {
                details['nouns'] = entities;

                details['nouns'] = details['nouns'].concat(
                    details['verbs'].filter(function (verb) {
                        return noun_suffixes.filter(function (suffix) {
                            return verb.match('\\' + suffix + '$') != undefined ||
                                verb.match('\\' + suffix + 's$') != undefined;
                        }).length > 0 || adj_suffixes.filter(function (suffix) {
                            return verb.match('\\' + suffix + '$') != undefined ||
                                verb.match('\\' + suffix + 's$') != undefined;
                        }).length > 0;
                    }));
            }

            tokens = tokens.map(function (tokens) {
                return tokens.filter(function (value) {
                    return value.length > 2 ||
                        details['verbs'].includes(value) ||
                        prep_list2.includes(value) || prep_list3.includes(value) ||
                        prep_list5.includes(value);
                })
            });

            if (tokens != undefined && tokens.length > 0) {
                resolve({
                    'tokens': tokens, 'details': details,
                    'stats': { 'words': words, 'count': Array.from(new Set(words)).length }
                });
            } else reject(0);
        });
    });
}

function split_by_conditions(tokens, callback) {
    let index = 0, substrings = [];
    while (index < tokens.length) {
        if ((callback(tokens[index], index) == true) || (index == 0)) {
            let prep_n = index, is_prep = false; index++;
            while ((index < tokens.length) && (is_prep == false))
                if (!callback(tokens[index], index)) index++;
                else is_prep = true;

            substrings.push(tokens.slice(prep_n, index));
        }
    }

    if ((substrings != undefined)) {
        return substrings.filter(function (sub) { return sub != ''; });
    }
}

function get_negatives(tokens) {
    var neg_tokens = tokens.filter(function (token) {
        return negatives.filter(function (negative) {
            return token == negative;
        }).length > 0;
    });

    return neg_tokens;
}

async function parse_verb_plus_noun(features, pos, concepts) {
    return new Promise(async (resolve, reject) => {
        var nouns = pos['nouns'];
        var verbs = pos['verbs'];
        var negatives = get_negatives(features);

        var intents = [];
        for (let index = 0; index < features.length; index++) {
            if ((verbs.includes(features[index]) == true) &&
                (negatives.includes(features[index]) == false)) {
                let noun_pos = index + 1;
                while (noun_pos < features.length) {
                    if (nouns.includes(features[noun_pos]) == true) {
                        intents.push({
                            'pos': [index, noun_pos],
                            'intent': {
                                'action': features[index],
                                'ent': features[noun_pos],
                                'negative': false
                            }
                        });
                    }

                    noun_pos++
                }
            }
        }

        for (let index = 0; index < intents.length; index++) {
            var neg_pos = intents[index]['pos'][0];
            while ((neg_pos >= 0) && !negatives.includes(
                features[neg_pos])) neg_pos--;

            if ((neg_pos != -1)) {
                intents[index]['intent']['negative'] = true;
            }
        }

        if ((intents != undefined)) {
            resolve(intents.map((obj) => { return obj['intent']; }));
        } else reject(0);
    });
}

async function parse_noun_plus_verb(features, pos, concepts) {
    return new Promise(async (resolve, reject) => {
        var nouns = pos['nouns'];
        var verbs = pos['verbs'];
        var negatives = get_negatives(features);

        var intents = [];
        for (let index = 0; index < features.length; index++) {
            if ((nouns.includes(features[index]) == true)) {
                let verb_pos = index + 1;
                while (verb_pos < features.length) {
                    if (verbs.includes(features[verb_pos]) == true) {
                        var neg_pos = verb_pos - 1, is_negative = false;
                        while (neg_pos >= index && !is_negative) {
                            is_negative = (negatives.includes(features[neg_pos--]) == true);
                        }

                        intents.push({
                            'intent': {
                                'action': features[verb_pos],
                                'ent': features[index],
                                'negative': is_negative
                            }
                        });
                    }

                    verb_pos++;
                }
            }
        }

        if ((intents != undefined)) {
            resolve(intents.map((obj) => { return obj['intent']; }));
        } else reject(0);
    });
}

async function parse_noun_plus_verb_rev(features, pos, concepts) {
    return new Promise(async (resolve, reject) => {
        var nouns = pos['nouns'];
        var verbs = pos['verbs'];
        var negatives = get_negatives(features);

        var intents = [], verb_pos_prev = 0;
        for (let index = 0; index < features.length; index++) {
            if ((nouns.includes(features[index]) == true)) {
                let verb_pos = index - 1, is_verb = false;
                while (verb_pos >= verb_pos_prev && !is_verb) {
                    if (verbs.includes(features[verb_pos]) == true) {
                        var neg_pos = verb_pos - 1, is_negative = false;
                        while (neg_pos >= 0 && !is_negative) {
                            is_negative = (negatives.includes(
                                features[neg_pos]) == true);

                            if (verbs.includes(features[neg_pos]) == true) {
                                is_negative = false; break;
                            }

                            neg_pos--;
                        }

                        intents.push({
                            'intent': {
                                'action': features[verb_pos],
                                'ent': features[index],
                                'negative': is_negative
                            }
                        });

                        is_verb = true;
                    }

                    verb_pos--;
                }

                verb_pos_prev = verb_pos + 1;
            }
        }

        if ((intents != undefined)) {
            resolve(intents.map((obj) => { return obj['intent']; }));
        } else reject(0);
    });
}


async function parse_noun_plus_suffix_noun(features, pos, concepts) {
    return new Promise(async (resolve, reject) => {
        var nouns = pos['nouns'];
        var verbs = pos['verbs'];
        var negatives = get_negatives(features);

        var intents = [];
        for (let index = 0; index < features.length; index++) {
            if ((nouns.includes(features[index]) == true)) {
                var noun_pos = 0;
                while (noun_pos < features.length) {
                    var is_suffix_noun = noun_suffixes.filter(function (suffix) {
                        return features[noun_pos].match('\\' + suffix + '$') != undefined ||
                            features[noun_pos].match('\\' + suffix + 's$') != undefined;
                    }).length > 0;

                    if ((is_suffix_noun == true) &&
                        (nouns.includes(features[noun_pos]) == true)) {

                        intents.push({
                            'intent': {
                                'action': features[index],
                                'ent': features[noun_pos],
                                'negative': false
                            }
                        });
                    }

                    noun_pos++;
                }
            }
        }

        if ((intents != undefined)) {
            resolve(intents.map((obj) => { return obj['intent']; }));
        } else reject(0);
    });
}

module.exports = {
    analyze: async function (document, concepts) {
        return new Promise(async (resolve, reject) => {
            await normalize(document, concepts).then(async (results) => {
                let index = 0, nouns_suggs = [];
                while (index < results['tokens'].length) {
                    const word_ps = new NlpWordPos();
                    var wd_stats = words_stats(results['tokens'][index]);
                    await word_ps.getPOS(results['tokens'][index]).then((details) => {
                        var nouns_stats = wd_stats.filter(function (stats) {
                            return details['nouns'].includes(stats['word']);
                        });

                        var nouns_prob_avg = nouns_stats.reduce((acc, stats) => {
                            return acc + stats['prob'];
                        }, 0) / nouns_stats.length;

                        nouns_suggs.push(nouns_stats.filter(function (stats) {
                            return stats['prob'].toFixed(4) >= nouns_prob_avg.toFixed(4);
                        }));
                    });

                    index++;
                }

                var nouns = results['details']['nouns'];
                var verbs = results['details']['verbs'];
                var adjectives = results['details']['adjectives'];
                var adverbs = results['details']['adverbs'];

                var intents = results['tokens'], sentences = [],
                    intents_length = results['tokens'].length;
                for (let index = 0; index < intents_length; index++) {
                    sentences = sentences.concat(split_by_conditions(intents[index], function (intent) {
                        var is_entity = intents[index].filter(function (intent) {
                            return prep_list5.filter(function (entity) {
                                return intent.match('^' + entity);
                            }).length > 0;
                        }).length > 0;

                        return prep_list1.filter(function (value) {
                            return value == intent;
                        }).length > 0 && !is_entity;
                    }));
                }

                if (sentences.length > 0) {
                    intents = sentences;
                }

                intents_length = intents.length; sentences = [];
                for (let index = 0; index < intents_length; index++) {
                    var intent_pos = 0;
                    sentences = sentences.concat(split_by_conditions(intents[index], function (intent, n) {
                        let neg_pos = n - 1, has_negative = false;
                        while ((neg_pos >= intent_pos) && (!has_negative)) {
                            has_negative = negatives.includes(intents[index][neg_pos]);
                            if (has_negative == false)
                                neg_pos--;
                        }

                        var dup_count = intents[index].filter(function (token) {
                            return token == intent;
                        }).length;

                        var split = ((dup_count >= 2) && (!nouns.includes(intent) &&
                            !verbs.includes(intent) && !adjectives.includes(intent) &&
                            !adverbs.includes(intent) && !prep_list1.includes(intent) &&
                            !prep_list2.includes(intent) && !prep_list3.includes(intent) &&
                            !prep_list4.includes(intent) && !prep_list5.includes(intent)));

                        if (split == true) {
                            intent_pos = n;
                        }

                        return (split == true) && (has_negative == false);
                    }));
                }

                if (sentences.length > 0) {
                    intents = sentences;
                }

                var entity_intents = intents;
                intents_length = intents.length; sentences = [];
                for (let index = 0; index < intents_length; index++) {
                    sentences = sentences.concat(split_by_conditions(intents[index], function (intent) {
                        return prep_list3.filter(function (value) {
                            return value == intent;
                        }).length > 0;
                    }));
                }

                if (sentences.length > 0) {
                    intents = sentences;
                }

                intents = intents.map(function (intents) {
                    return intents.filter(function (intent) {
                        return prep_list3.filter(function (prep) {
                            return prep == intent;
                        }).length == 0;
                    })
                });

                intents_length = intents.length; sentences = [];
                for (let index = 0; index < intents_length; index++) {
                    sentences = sentences.concat(split_by_conditions(intents[index], function (intent) {
                        var is_entity = intents[index].filter(function (intent) {
                            return prep_list5.filter(function (entity) {
                                return intent.match('^' + entity);
                            }).length > 0;
                        }).length > 0;

                        return negatives.filter(function (value) {
                            return value == intent;
                        }).length > 0 && !is_entity;
                    }));
                }

                if (sentences.length > 0) {
                    intents = sentences;
                }

                intents_length = intents.length; sentences = [];
                for (let index = 0; index < intents_length; index++) {
                    sentences = sentences.concat(split_by_conditions(intents[index],
                        function (intent, n) {
                            let split = false;
                            var is_prep = prep_list2.filter(
                                function (value) { return value == intent; }).length > 0;

                            if (is_prep == true) {
                                if ((n > 0) && (n < intents[index].length - 1)) {
                                    var is_noun_left = nouns.filter(function (noun) {
                                        return noun == intents[index][n - 1];
                                    }).length > 0;

                                    var is_noun_right = nouns.filter(function (noun) {
                                        return noun == intents[index][n + 1];
                                    }).length > 0;

                                    var is_verb_left = verbs.filter(function (verb) {
                                        return verb == intents[index][n - 1];
                                    }).length > 0;

                                    var is_verb_right = verbs.filter(function (verb) {
                                        return verb == intents[index][n + 1];
                                    }).length > 0;

                                    if ((prep_list4.includes(intents[index][n - 1])) ||
                                        (prep_list4.includes(intents[index][n + 1]))) {
                                        split = false;
                                    }

                                    else if ((is_noun_left = true) && (is_noun_right == true)) {
                                        split = false;
                                    }

                                    else if (((is_noun_left == true) && (is_verb_right == true)) ||
                                        ((is_verb_left == true) && (is_noun_right == true))) {
                                        split = (intent == 'or') ? false : true;
                                    }

                                    else {
                                        var is_adj_left = adjectives.filter(function (adjective) {
                                            return adjective == intents[index][n - 1];
                                        }).length > 0;

                                        var is_adj_right = adjectives.filter(function (adjective) {
                                            return adjective == intents[index][n + 1];
                                        }).length > 0;

                                        var is_adv_left = adverbs.filter(function (adverb) {
                                            return adverb == intents[index][n - 1];
                                        }).length > 0;

                                        var is_adv_right = adverbs.filter(function (adverb) {
                                            return adverb == intents[index][n + 1];
                                        }).length > 0;

                                        var is_negative_left = negatives.includes(intents[index][n - 1]);
                                        var is_negative_right = negatives.includes(intents[index][n + 1]);

                                        if (intent == 'or') {
                                            split = (!(is_adj_left && is_adj_right)) ? false : true;
                                            split = (!(is_adv_left && is_adv_right)) ? false : true;
                                            split = ((is_negative_left == true || is_negative_right == true)) ? true : false;
                                        }

                                        else if (intent == 'and') {
                                            if (!(is_noun_left && is_noun_right)) {
                                                split = true;
                                            }
                                        }
                                    }

                                    return split;
                                }
                            }
                        }));
                }

                if (sentences.length > 0) {
                    intents = sentences;
                }

                intents = intents.map(function (intents) {
                    var is_entity = intents.filter(function (intent) {
                        return prep_list5.filter(function (entity) {
                            return intent.match('^' + entity);
                        }).length > 0;
                    }).length > 0;

                    return (is_entity == false) ?
                        intents.filter(function (value) {
                            return nouns.includes(value) ||
                                verbs.includes(value) || negatives.includes(value);
                        }) : intents;
                }).filter(function (intents) {
                    return intents.length > 0;
                });

                var predicates = [];
                for (let index = 0; index < intents.length; index++) {
                    if (intents[index].length > 1) {
                        await parse_verb_plus_noun(intents[index],
                            results['details'], concepts).then((results) => {
                                if (results != undefined && results.length > 0) {
                                    predicates = predicates.concat(results);
                                }
                            });
                    }
                }

                for (let index = 0; index < entity_intents.length; index++) {
                    if (entity_intents[index].length > 1) {
                        await parse_noun_plus_verb(entity_intents[index],
                            results['details'], concepts).then((results) => {
                                predicates = predicates.concat(results);
                            });
                    }
                }

                for (let index = 0; index < entity_intents.length; index++) {
                    if (entity_intents[index].length > 1) {
                        await parse_noun_plus_suffix_noun(entity_intents[index],
                            results['details'], concepts).then((results) => {
                                predicates = predicates.concat(results);
                            });
                    }
                }

                for (let index = 0; index < entity_intents.length; index++) {
                    if (entity_intents[index].length > 1) {
                        await parse_noun_plus_verb_rev(entity_intents[index],
                            results['details'], concepts).then((results) => {
                                if (results != undefined && results.length > 0) {
                                    predicates = predicates.concat(results);
                                }
                            });
                    }
                }

                var intents_results = [];
                for (let i = 0; i < predicates.length; i++) {
                    for (let j = 0; j < concepts.length; j++) {
                        var is_similar = false;

                        var is_negative1 = predicates[i]['negative'];
                        var is_negative2 = concepts[j]['negative'];

                        var action1 = predicates[i]['action'];
                        var action2 = concepts[j]['intent']['action'];

                        var subject1 = predicates[i]['ent'];
                        var subject2 = concepts[j]['intent']['ent'];

                        if (is_negative1 == is_negative2) {
                            if ((action1 == action2) && (subject1 == subject2)) {
                                is_similar = true;
                            }
                        }

                        if (is_similar == true) {
                            intents_results.push(concepts[j]);
                        }
                    }
                }

                if (intents_results.length > 0) {
                    resolve({
                        'suggestions': nouns_suggs,
                        'intents': Array.from(new Set(intents_results))
                    });
                } else reject(0);
            });
        });
    },
}